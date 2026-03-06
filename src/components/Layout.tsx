import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app">
      <header className="header">
        <h1>Todo App</h1>
        <nav className="nav">
          <NavLink to="/" end>
            Todos
          </NavLink>
          <NavLink to="/new">New</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
