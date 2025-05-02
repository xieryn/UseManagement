import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, addUser } from '../features/users/userSlice'; // <-- addUser imported

const UserList = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector(state => state.users);
    const [search, setSearch] = useState('');
    const [newName, setNewName] = useState(''); // <-- new
    const [newEmail, setNewEmail] = useState(''); // <-- new

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleAddUser = () => { // <-- new
        if (newName.trim() && newEmail.trim()) {
            dispatch(addUser({ name: newName, email: newEmail }));
            setNewName('');
            setNewEmail('');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="spinner">Loading...</div>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="add-user-form"> {/* <-- new */}
                <input
                    type="text"
                    placeholder="Name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                />
                <button onClick={handleAddUser}>Add User</button>
            </div>

            <div className="user-table">
                <div className="table-header">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Actions</span>
                </div>
                {filteredUsers.map(user => (
                    <div className="table-row" key={user.id}>
                        <span>{user.name}</span>
                        <span>{user.email}</span>
                        <span>
                            <button className="delete-btn" onClick={() => dispatch(deleteUser(user.id))}>Delete</button>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;
