import React, { useEffect, useState } from 'react';
import initialState, { getRandomProfile } from "./initialState";
import { CreateUser, Header, MatchHistory, NotFound, Profile } from "./Components";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  let [currentProfile, setCurrentProfile] = useState(initialState.currentProfile);
  let [likeHistory, setLikeHistory] = useState(initialState.likeHistory);
  let [passHistory, setPassHistory] = useState(initialState.passHistory);

  useEffect(() => {
    console.log("-- App rerenders --");
  });

  let onLikeButtonClick = () => {
    let newLikeHistory = [...likeHistory, currentProfile];
    let newProfile = getRandomProfile();
    setCurrentProfile(newProfile);
    setLikeHistory(newLikeHistory);
  };

  let onPassButtonClick = () => {
    let newPassHistory = [...passHistory, currentProfile];
    let newCurrentProfile = getRandomProfile();
    setPassHistory(newPassHistory);
    setCurrentProfile(newCurrentProfile);
  };

  let onUnmatchButtonClick = (id: number) => {
    let newLikeHistory = likeHistory.filter((i) => i.id !== id);
    setLikeHistory(newLikeHistory);
  };

  let profile = <Profile {...currentProfile}
    onLikeButtonClick={onLikeButtonClick}
    onPassButtonClick={onPassButtonClick} />

  let matchHistory = <MatchHistory likeHistory={likeHistory}
    onUnmatchButtonClick={onUnmatchButtonClick} />

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route path="/" element={profile} />
            <Route path="match-history" element={matchHistory} />            
            <Route path="create-user" element={<CreateUser />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>
    </>
  );
}



export default App;
