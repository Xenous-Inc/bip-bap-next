import MarkerIcon from '~/shared/assets/icons/marker.svg';
import { Map } from '~/widgets/Map';

export default () => {
    return (
        <main>
            <MarkerIcon className='absolute bottom-11 top-32 z-50 h-32 w-32' />
            <Map />
        </main>
    );
};
