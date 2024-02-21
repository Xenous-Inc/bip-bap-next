import { useEffect } from 'react';
import { Loader } from '~/entities/Loader';
import { MapComponent } from '~/widgets/Map';

export default () => {
    useEffect(() => {
        console.log(sessionStorage);
    }, [sessionStorage]);
    return (
        <main className={'flex min-h-screen w-full'}>
            <MapComponent />
        </main>
    );
};
