'use client';

import { useAtomValue } from 'jotai';
import type mapboxgl from 'mapbox-gl';
import { filterStateAtom } from '~/entities/FilterMenu';
import { type BBox } from 'geojson';
import { useEffect, useState, useRef, useMemo } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { type MapRef, Marker, type ViewState } from 'react-map-gl';
import { type ClusterProperties, type PointFeature } from 'supercluster';
import useSupercluster from 'use-supercluster';
import { Loader } from '~/entities/Loader';
import MarkerIcon from '~/shared/assets/icons/marker.svg';
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

export const MapComponent = () => {
    const [bounds, setBounds] = useState<BBox>([
        73.24717872822367, 54.94104340796835, 73.49128120625045, 55.03352746035742,
    ]);

    const mapRef = useRef<MapRef>(null);

    const filterState = useAtomValue(filterStateAtom);

    const [viewState, setViewState] = useState<ViewState>(initialViewState);

    const params = filterState.params;
    const display = filterState.display;

    const { data: sensors = [], isFetching } = api.sensor.getByLocation.useQuery({location: bounds, paramsFilter: params, displayFilter: display}, {
        queryKey: ['sensor.getByLocation', bounds],
        trpc: { abortOnUnmount: true },
        keepPreviousData: true,
    });
  
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
            },
            geometry: {
                type: 'Point',
                coordinates: [sensor.longitude, sensor.latitude],
            },
        })) as unknown as Array<PointFeature<ClusterProperties & SensorProps>>;
    }, [sensors]);

    const { clusters, supercluster } = useSupercluster({
        bounds,
        points,
        zoom: viewState.zoom,
        options: { radius: 60, maxZoom: 12 },
    });

    useEffect(() => {
        console.log(clusters);
    }, [clusters]);

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
                {isFetching && <Loader />}
                {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;

                    const { cluster: isCluster, point_count: pointCount } = cluster.properties;
                    if (!latitude || !longitude) {
                        return null;
                    }

                    if (isCluster) {
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
                                    className='flex items-center justify-center bg-green-500 text-white'
                                    style={{
                                        width: `${10 + (pointCount / points.length) * 50}px`,
                                        height: `${10 + (pointCount / points.length) * 50}px`,
                                        borderRadius: '100%',
                                    }}
                                >
                                    {pointCount}
                                </div>
                            </Marker>
                        );
                    }

                    return (
                        <Marker
                            key={`point-${cluster.properties.sensorId}`}
                            latitude={latitude ?? -1}
                            longitude={longitude ?? -1}
                            anchor='bottom'
                            style={{ display: 'flex', width: 50, height: 50 }}
                        >
                            <MarkerIcon className={'fill-btn-green stroke-green-500'} />
                        </Marker>
                    );
                })}
            </Map>
        </div>
    );
};
