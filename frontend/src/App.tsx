import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// organizer
import CreateEventOrganizer from "./pages/Organizer/CreateEvent";


// Attendee
import RegisterAttendee from "./pages/Attendee/Register";
import LoginAttendee from "./pages/Attendee/Login";
import ExploreAttendee from "./pages/Attendee/Explore";
import BookedAttendee from "./pages/Attendee/BookedEvents";
import AccountAttendee from "./pages/Attendee/Account";
import EventDetailsAttendee from "./pages/Attendee/EventDetails";

// Admin
import AdminHome from "./pages/Admin/AdminHome";
import AdminEvents from "./pages/Admin/Events";
import Organizers from "./pages/Admin/Organizers";
import Settings from "./pages/Admin/Settings";
import Login from "./pages/Admin/Login";
import Home from "./pages/Organizer/Home";
import DraftEvents from "./pages/Organizer/DraftEvents";
import SubmittedEvents from "./pages/Organizer/SubmittedEvents";
import Venues from "./pages/Organizer/Venues";
import Speakers from "./pages/Organizer/Speakers";
import CreateVenueOrganizer from "./pages/Organizer/CreateVenue";
import CreateSpeekerOrganizer from "./pages/Organizer/CreateSpeeker";

// https://192.168.201.124:7096/api/Auth/login

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Attendee */}

          <Route path="/attendee/login" element={<LoginAttendee />} />
          <Route path="/attendee/register" element={<RegisterAttendee />} />
          <Route path="/attendee/Explore" element={<ExploreAttendee />} />
          <Route path="/attendee/BookedEvents" element={<BookedAttendee />} />
          <Route path="/attendee/Account" element={<AccountAttendee />} />
          <Route
            path="/attendee/EventDetails/:id"
            element={<EventDetailsAttendee />}
          />

          {/* Organizer */}

          <Route
            path="/organizer/CreateEvent"
            element={<CreateEventOrganizer />}
          />
          <Route path="/organizer/Home" element={<Home />} />
          <Route path="/organizer/DraftEvents" element={<DraftEvents />} />
          <Route path="/organizer/SubmittedEvents" element={<SubmittedEvents />} />
          <Route path="/organizer/Venues" element={<Venues />} />
          <Route path="/organizer/Speakers" element={<Speakers />} />
          <Route
            path="/organizer/CreateVenue"
            element={<CreateVenueOrganizer />}
          />
          <Route path="/organizer/CreateSpeaker" element={<CreateSpeekerOrganizer/>}/>
          {/* Admin */}
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/organizers" element={<Organizers />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/Login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
