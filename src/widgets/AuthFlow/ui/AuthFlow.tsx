import { useEffect, useState } from 'react';
import { type PopupProps } from '~/entities/Popup';
import { AuthPopup } from '~/widgets/AuthPopup/ui/AuthPopup';
import { PasswordRecoveryPopup } from '~/widgets/PaswordRecoveryPopup';
import { RegisterPopup } from '~/widgets/RegisterPopup';

export const AuthFlow: React.FC<Omit<PopupProps, 'title'>> = props => {
    const { isOpen, setIsOpen } = props;
    const [isSignIn, setIsSignIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isRecovery, setIsRecovery] = useState(false);

    useEffect(() => {
        setIsSignIn(isOpen);
        setIsOpen(isOpen);
        if (!isOpen) {
            setIsSignUp(isOpen);
            setIsRecovery(isOpen);
        }
    }, [isOpen]);

    const hadleSignInForRegister = (state: boolean) => {
        setIsSignIn(state);
        setIsSignUp(prev => !prev);
    };

    const hadleSignInForRecovery = (state: boolean) => {
        setIsSignIn(state);
        setIsRecovery(prev => !prev);
    };

    const hadleSignUp = (state: boolean) => {
        setIsSignUp(state);
        setIsSignIn(prev => !prev);
    };

    const hadleRecovery = (state: boolean) => {
        setIsRecovery(state);
        setIsSignIn(prev => !prev);
    };

    return (
        <div>
            <AuthPopup
                isOpen={isSignIn}
                setIsOpen={setIsSignIn}
                hadleRecovery={hadleRecovery}
                hadleRegister={hadleSignUp}
            />
            <RegisterPopup isOpen={isSignUp} setIsOpen={setIsSignUp} hadleSignIn={hadleSignInForRegister} />
            <PasswordRecoveryPopup isOpen={isRecovery} setIsOpen={setIsRecovery} hadleSignIn={hadleSignInForRecovery} />
        </div>
    );
};
