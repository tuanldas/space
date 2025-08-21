import { Fragment, useEffect } from "react";
import { Container } from "@/components/common/container";
import { useToolbar } from "@/providers/toolbar-provider";

export function DashboardPage() {
    const { setToolbarTitle } = useToolbar();

    useEffect(() => {
        setToolbarTitle("sidebar.home");
    }, [setToolbarTitle]);

    return (
        <Fragment>
            <Container>{/* page content */}</Container>
        </Fragment>
    );
}
