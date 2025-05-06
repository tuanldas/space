import {Fragment, useEffect, useState} from 'react';
import {WalletContent} from '@/pages/Wallets/WalletContent.tsx';
import {Button} from '@/components/ui/button.tsx';
import {Container} from '@/components/common/container';
import {useToolbar} from '@/layouts/demo5/layout';
import {CreateWallet} from './blocks/CreateWallet';

const Wallets = () => {
    const {setToolbarActionContent} = useToolbar();

    const [isOpenCreateWallet, setIsOpenCreateWallet] = useState(false);

    const handleOpenCreateWallet = () => {
        setIsOpenCreateWallet(!isOpenCreateWallet);
    };

    useEffect(() => {
        const popoverContent = (
            <Button onClick={() => handleOpenCreateWallet()} className={'btn btn-sm btn-primary btn-outline'}>
                Tạo ví
            </Button>
        );

        setToolbarActionContent(popoverContent);

        return () => {
            setToolbarActionContent(null);
        };
    }, [setToolbarActionContent]);


    return (
        <Fragment>
            <Container>
                <WalletContent/>
            </Container>
            <CreateWallet isOpen={isOpenCreateWallet} onOpenChange={handleOpenCreateWallet}/>
        </Fragment>
    );
};

export default Wallets;
