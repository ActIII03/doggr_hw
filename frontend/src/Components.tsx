import React, { useEffect, useMemo, useState } from "react";
import { Profile as ProfileType } from "./types/StateTypes";
import { Link, Outlet } from "react-router-dom";
import { User } from "./services/UserService";

export type ProfileProps = {
  id: number,
  imgUri: string,
  name: string,
  onLikeButtonClick: () => void,
  onPassButtonClick: () => void,
}

export function Profile(props: ProfileProps) {
  let { imgUri, name, onLikeButtonClick, onPassButtonClick } = props;

  useEffect(() => {
    console.log("Profile rerendered");
  });

  return (
    <div>
      <img src={imgUri} alt="Profile of pet" />
      <h2>{name}</h2>
      <div>
        <button onClick={onPassButtonClick}>Pass</button>
        <button onClick={onLikeButtonClick}>Like</button>
      </div>
    </div>
  );
}

type FilterBarProps = {
  onApply: (filterString: string) => void,
}

function FilterBar({ onApply }: FilterBarProps) {
  let [filterString, setFilterString] = useState("");

  let handleChange = (event) => {
    // onApply(filterString); // this is a bad idea, if you want to do this: use lodash.debounce!
    setFilterString(event.target.value);
  };

  let handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      onApply(filterString)
    }
  }

  return (
    <div>
      <label htmlFor="filter">Filter Matches:</label> &nbsp;
      <input id="filter"
        type="text"
        value={filterString}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      /> &nbsp;
      <button onClick={() => onApply(filterString)}>Apply</button>
    </div>
  )
}

type MatchHistoryProfileProps = ProfileType & { onUnmatchButtonClick: (id: number) => void }

function MatchHistoryProfile(props: MatchHistoryProfileProps) {
  let { id, thumbUri, name, onUnmatchButtonClick } = props;

  useEffect(() => {
    console.log(`Match History Profile ${name} rerendered`);
  });

  return <div>
    <img src={thumbUri} alt="" />
    {name}
    &nbsp;
    <button onClick={() => onUnmatchButtonClick(id)}>Unmatch</button>
  </div>
}

export type MatchHistoryProps = {
  likeHistory: Array<ProfileType>,
  onUnmatchButtonClick: (id: number) => void,
}

export function MatchHistory({ likeHistory, onUnmatchButtonClick }: MatchHistoryProps) {
  let [filterString, setFilterString] = useState("");

  let profilesToDisplay = useMemo(
    () => likeHistory.filter(s => s.name.includes(filterString)),
    [likeHistory, filterString]
  );

  useEffect(() => {
    console.log("Match History rerendered");
  });

  let filterBar = <FilterBar onApply={setFilterString} />;

  return (
    <div>
      <h3>Past matches:</h3>
      {filterBar}
      <br />
      {profilesToDisplay.map(
        profile =>
          <MatchHistoryProfile
            onUnmatchButtonClick={onUnmatchButtonClick}
            key={profile.id}
            {...profile} />
      )}
    </div>
  )
}

export const NotFound = () => (
  <div>
    <h1>404 - Not Found!</h1>
    <Link to="/">Go Home</Link>
  </div>
);

export const Header = () => {
  return (<div>
    <h1>Doggr</h1>
    <h3>Where your pets finds love(tm)</h3>
    <Link to="/">Dashboard</Link>
    &nbsp; | &nbsp;
    <Link to="/match-history">Match History</Link>
    &nbsp; | &nbsp;
    <Link to="/create-user">Create User</Link>
    <br />
    <Outlet />
  </div>
  );
}


const initialUserState = {
  email: "",
  password: "",
};

export const CreateUser = () => {

  const [user, setUser] = useState(initialUserState);
  const [submitted, setSubmitted] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);


  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const saveUser = () => {
    User.create(user)
      .then(res => {
        setSubmitted(true);
        setSubmitFailed(false);
        console.log(res.data);
      })
      .catch(e => {
        setSubmitFailed(true);
        console.log("Error creating new user", e);
      })
  }

  const resetUser = () => {
    setUser(initialUserState);
    setSubmitted(false);
  }

  return (
    <div>
      {submitted ? (
        <>     {/* If we've already submitted, show this piece*/}
          <h4>You submitted successfully!</h4>
          <button onClick={resetUser}>
            Reset
          </button>
        </>
      ) : (
        <>   {/* If we've NOT already submitted, show this piece*/}
          {submitFailed && //This will only render if our prior submit failed
            //we could add a div here and style this separately
            <h2>Email already exists!</h2>
          }
          <CreateUserForm handleInputChange={handleInputChange} saveUser={saveUser} user={user} />
        </>
      )
      }
    </div>
  )
}

export const CreateUserForm = ({ handleInputChange, saveUser, user }) => {
  return (
    <div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          required
          value={user.email}
          onChange={handleInputChange}
          name="email"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          required
          value={user.password}
          onChange={handleInputChange}
          name="password"
        />
      </div>

      <button onClick={saveUser}>
        Create
      </button>
    </div>
  )
}