import cn from 'classnames';
import FadeIcon from '~/shared/assets/icons/fade.svg';
import FlowerIcon from '~/shared/assets/icons/flower.svg';
import SkullIcon from '~/shared/assets/icons/skull.svg';

interface SideScaleProps {
    className?: string;
}

export const SideScale: React.FC<SideScaleProps> = ({ className }) => {
    return (
        <div className={cn('rounded-full border-2 p-2.5', className)}>
            <div className={cn('flex flex-col items-center justify-between gap-y-2')}>
                <SkullIcon className={cn('h-6 w-6')} />
                <FadeIcon className={cn('h-full w-1')} />
                <FlowerIcon className={cn('h-6 w-6')} />
            </div>
        </div>
    );
};
