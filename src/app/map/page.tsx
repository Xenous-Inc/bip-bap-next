import { Loader } from '~/entities/Loader';
import { MapComponent } from '~/widgets/Map';

export default () => {
    return (
        <main className={'flex min-h-screen w-full'}>
            <MapComponent />
        </main>
    );
};
