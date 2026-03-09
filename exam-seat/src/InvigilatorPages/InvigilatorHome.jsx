import SideBar from "../SideBarComponents/SideBar.jsx";


export default function InvigilatorHome({ username, onLogout }) {
  return (

    <>
    <SideBar 
        onLogout={onLogout}
        username={username}>
    </SideBar>
    </>
  );
}