import React, { useState } from "react";
import LoginApp from "./login-woltrio/App.jsx";
import TodoApp from "./todo-wol/App.jsx";

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <div>
      {userLoggedIn ? (
        <TodoApp />
        
      ) : (
        <LoginApp onLoginSuccess={() => setUserLoggedIn(true)} />
      )}
    </div>
  );
};

export default App;