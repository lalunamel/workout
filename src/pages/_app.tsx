import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useLocation, Link, Outlet } from "react-router";

const AppLayout = () => {
  return (
    <>
      <Outlet />
      <BottomNavigation showLabels value={useLocation().pathname}>
        <BottomNavigationAction
          component={Link}
          label="Workouts"
          icon={<FitnessCenterIcon />}
          value="/workouts"
          to="/workouts"
        />
        <BottomNavigationAction
          component={Link}
          label="Graphs"
          icon={<TimelineIcon />}
          value="/graphs"
          to="/graphs"
        />
        <BottomNavigationAction
          component={Link}
          label="Settings"
          icon={<SettingsIcon />}
          value="/settings"
          to="/settings"
        />
      </BottomNavigation>
    </>
  );
};

export default AppLayout;
