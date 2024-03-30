function HomeHeader() {
    return (
        <div className="checklist-header">
            <table>
                <tbody>
                    <tr>
                        <BackButton />
                        <td>{title}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>{subtitle}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
    // return (
    //     <>
    //         <h1>Welcome!</h1>
    //         <p>Adding anything to the list today?</p>
    //     </>
    // )
}


function Home() {
    return (
        <div>
            <HomeHeader />
        </div>
    )
}


export default Home;