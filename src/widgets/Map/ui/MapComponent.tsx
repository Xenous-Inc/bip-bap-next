'use client';
import { filterStateAtom } from '~/entities/FilterMenu';
import { type BBox } from 'geojson';
import { useAtomValue } from 'jotai';
import type mapboxgl from 'mapbox-gl';
import { useEffect, useState, useRef, useMemo } from 'react';
import type Supercluster from 'supercluster';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { type MapRef, Marker, type ViewState } from 'react-map-gl';
import { type ClusterProperties, type PointFeature } from 'supercluster';
import useSupercluster from 'use-supercluster';
import { filterStateAtom } from '~/entities/FilterMenu';
import { Loader } from '~/entities/Loader';
import { Colors, ValueLimit } from '~/entities/MarkerColor';
import MarkerIcon from '~/shared/assets/icons/marker.svg';
import IconMinus from '~/shared/assets/icons/minus.svg';
import IconPlus from '~/shared/assets/icons/plus.svg';
import { env } from '~/shared/lib';
import { api } from '~/trpc/react';
import { type RouterOutputs } from '~/trpc/shared';

const initialViewState: ViewState = {
    longitude: 73.3682,
    latitude: 54.9881,
    zoom: 12,
    bearing: 0,
    pitch: 0,
    padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
};

type SensorOutputType = RouterOutputs['sensor']['getByLocation'];

type SensorProps = { sensorId: string } & Omit<SensorOutputType[number], 'latitude' | 'longitude' | 'id'>;

type SensorPoint = PointFeature<ClusterProperties & SensorProps>;

const getClusterColor = (
    sensors: SensorPoint[] | Array<Supercluster.ClusterFeature<Supercluster.AnyProps>> | undefined
) => {
    if (!sensors) {
        return Colors.NORMAL;
    }
    const average =
        sensors.reduce((acc, curr) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const statusAverage = curr.properties?.status?.average;
            const averageToAdd = statusAverage ?? 1;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return acc + averageToAdd;
        }, 0) / sensors.length;

    if (!average) {
        return Colors.NORMAL;
    }
    if (average <= ValueLimit.PERFECT) {
        return Colors.PERFECT;
    }
    if (average <= ValueLimit.NORMAL) {
        return Colors.NORMAL;
    }
    if (average > ValueLimit.DANGER) {
        return Colors.DANGER;
    }
    return Colors.NORMAL;
};

export const MapComponent = () => {
    const [bounds, setBounds] = useState<BBox>([
        73.24717872822367, 54.94104340796835, 73.49128120625045, 55.03352746035742,
    ]);

    const mapRef = useRef<MapRef>(null);

    const filterState = useAtomValue(filterStateAtom);

    const [viewState, setViewState] = useState<ViewState>(initialViewState);

    const params = filterState.params;
    const display = filterState.display;

    const { data: sensors = [], isFetching } = api.sensor.getByLocation.useQuery(
        { location: bounds, paramsFilter: params, displayFilter: display },
        {
            //@ts-ignore
            queryKey: ['sensor.getByLocation', bounds],
            trpc: { abortOnUnmount: true },
            keepPreviousData: true,
        }
    );

    const points = useMemo(() => {
        return sensors.map(sensor => ({
            type: 'Feature',
            properties: {
                sensorId: sensor.id,
                location: sensor.location,
                name: sensor.name,
                model: sensor.model,
                version: sensor.version,
                firmwareVersion: sensor.firmwareVersion,
                serialNumber: sensor.serialNumber,
                status: sensor.status,
                values: sensor.values,
            },
            geometry: {
                type: 'Point',
                coordinates: [sensor.longitude, sensor.latitude],
            },
        })) as SensorPoint[];
    }, [sensors]);

    const { clusters, supercluster } = useSupercluster({
        bounds,
        points,
        zoom: viewState.zoom,
        options: { radius: 60, maxZoom: 12 },
    });
  
    const handleZoomIn = () => {
        const newZoom = Math.min(viewState.zoom + 1, 20);
        mapRef.current?.setZoom(newZoom);
        setBounds(mapRef.current?.getBounds().toArray().flat() as BBox);
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(viewState.zoom - 1, 0);
        mapRef.current?.setZoom(newZoom);
        setBounds(mapRef.current?.getBounds().toArray().flat() as BBox);
    };
    return (
        <div className={'flex h-screen w-full bg-white'}>
            <Map
                initialViewState={viewState}
                mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
                onMoveEnd={evt => {
                    setViewState(evt.viewState);
                    setBounds(evt.target.getBounds().toArray().flat() as BBox);
                }}
                ref={mapRef}
                mapStyle={'mapbox://styles/mapbox/streets-v11'}
                style={{ width: '100%', height: '100vh', display: 'flex' }}
            >
                <div className={'absolute right-6 top-1/2 mb-10 mr-2.5 flex -translate-y-1/2 transform flex-col gap-6'}>
                    <button
                        onClick={handleZoomIn}
                        className={'flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md'}
                    >
                        <IconPlus style={{ width: '31px', height: '31px' }} />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className={'flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md'}
                    >
                        <IconMinus style={{ width: '31px', height: '31px' }} />
                    </button>
                </div>
                {isFetching && <Loader />}
                {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;

                    const { cluster: isCluster, point_count: pointCount } = cluster.properties;
                    if (!latitude || !longitude) {
                        return null;
                    }

                    if (isCluster) {
                      
                        const includedPoints = supercluster?.getChildren(cluster.properties.cluster_id);
                        const clusterColor = getClusterColor(includedPoints);

                        return (
                            <Marker
                                key={`cluster-${cluster.properties.cluster_id}`}
                                latitude={latitude}
                                longitude={longitude}
                                onClick={() => {

                                    const expansionZoom = Math.min(
                                        supercluster?.getClusterExpansionZoom(cluster.properties.cluster_id) ?? 20,
                                        20
                                    );
                                    mapRef.current?.flyTo({ zoom: expansionZoom, center: [longitude, latitude] });
                                }}
                            >
                                <div
                                    className={'flex items-center justify-center rounded-full bg-btn-green text-white'}
                                    style={{
                                        width: `${10 + (pointCount / points.length) * 50}px`,
                                        height: `${10 + (pointCount / points.length) * 50}px`,
                                        backgroundColor: clusterColor,
                                    }}
                                >
                                    {pointCount}
                                </div>
                            </Marker>
                        );
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    const color = cluster.properties.status.color as string;
                    return (
                        <Marker
                            key={`point-${cluster.properties.sensorId}`}
                            latitude={latitude ?? -1}
                            longitude={longitude ?? -1}
                            anchor='bottom'
                            style={{ display: 'flex', width: 50, height: 50 }}
                        >
                            <MarkerIcon style={{ fill: color, stroke: color }} />
                        </Marker>
                    );
                })}
            </Map>
        </div>
    );
};
