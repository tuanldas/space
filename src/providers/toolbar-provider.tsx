import { createContext, ReactNode, useContext, useState } from 'react';

type ToolbarContextType = {
    toolbarActions: ReactNode | null;
    setToolbarActions: (actions: ReactNode) => void;
    toolbarTitle: ReactNode | null;
    setToolbarTitle: (title: ReactNode | null) => void;
    isToolbarHidden: boolean;
    setToolbarHidden: (hidden: boolean) => void;
};

const ToolbarContext = createContext<ToolbarContextType | undefined>(undefined);

export const ToolbarProvider = ({ children }: { children: ReactNode }) => {
    const [toolbarActions, setToolbarActions] = useState<ReactNode | null>(null);
    const [toolbarTitle, setToolbarTitle] = useState<ReactNode | null>(null);
    const [isToolbarHidden, setToolbarHidden] = useState<boolean>(false);

    return (
        <ToolbarContext.Provider
            value={{
                toolbarActions,
                setToolbarActions,
                toolbarTitle,
                setToolbarTitle,
                isToolbarHidden,
                setToolbarHidden,
            }}
        >
            {children}
        </ToolbarContext.Provider>
    );
};

export const useToolbar = () => {
    const context = useContext(ToolbarContext);
    if (context === undefined) {
        throw new Error('useToolbar must be used within a ToolbarProvider');
    }
    return context;
};
