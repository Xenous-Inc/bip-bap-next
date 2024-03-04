import LoaderIcon from '~/shared/assets/icons/loader.svg';

export const Loader = () => {
    //TODO: rewrite to loader bar;
    return (
        <div className='absolute left-1/2 top-1/2  flex h-12 w-12  items-center justify-center'>
            <div className='h-12 w-12 animate-spin'>
                <LoaderIcon />
            </div>
        </div>
    );
};
