import { useLocation } from "react-router-dom";
import GeneralConfigSystem from "./configuration/GeneralConfigSystem";
import NotificationSettings from "./configuration/NotificationSettings";
import IntegrationsSettings from "./configuration/IntegrationsSettings";
import SecuritySettings from "./configuration/SecuritySettings";
import BackupSettings from "./configuration/BackupSettings";

export default function Configuration() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view') || 'generalConfig';

    const choiceComponent: Record<string, React.ReactNode> = {
        generalConfig: <GeneralConfigSystem />,
        notification: <NotificationSettings />,
        intregration: <IntegrationsSettings />,
        security: <SecuritySettings />,
        BackUpAndRestauration: <BackupSettings />,
    }

    return (
        <>
            <div>
                {choiceComponent[viewParam]}
            </div>
        </>
    );
}