import NotificationButton from "../components/NotificationButton";
export default function HomeHeader() {
    return (
        <div className="checklist-header">
            <table>
                <tbody>
                    <tr>
                        <td>Welcome</td>
                        <NotificationButton />
                    </tr>
                    <tr>
                        <td colSpan={2}>Adding anything to the list today?</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}