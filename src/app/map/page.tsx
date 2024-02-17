import MarkerIcon from '~/shared/assets/icons/marker.svg';
import { MapComponent } from '~/widgets/Map';

export default () => {
    return (
        <main className={'flex min-h-screen w-full'}>
            <MarkerIcon className='absolute bottom-11 top-32 z-50 h-32 w-32' />
            <MapComponent />
        </main>
    );
};
