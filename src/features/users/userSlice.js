import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const loadUsersFromLocalStorage = () => {
    try {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Failed to load users from localStorage', error);
        return [];
    }
};

const saveUsersToLocalStorage = (users) => {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error('Failed to save users to localStorage', error);
    }
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const Names = [
        { name: 'Mayi Clutz', email: 'mayiclutz@gmail.com' },
        { name: 'Anna Girl', email: 'Annagirl@Yahoo.com' },
        { name: 'Anne Avilable', email: 'anneavilablesha@outlook.com' },
        { name: 'Mayan Yah', email: 'mayannn@gmail.com' },
        { name: 'Ian Sy', email: 'anaknihenrysy@gmail.com' },
        { name: 'Marianne Capuno', email: 'capuno.marianne.dll@gmail.com' },
        { name: 'Teh Yan', email: 'Tehya@yahoo.com' },
        { name: 'Maria C', email: 'mariaclarapi@protonmail.com' },
        { name: 'Marian Rivera', email: 'officialmarianrivera@gmail.com' },
        { name: 'It Girls', email: 'powergirlshaha@gmail.com' },
    ];

    const Users = response.data.map((user, index) => ({
        ...user,
        name: Names[index % Names.length].name,
        email: Names[index % Names.length].email,
    }));

    return Users;
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: loadUsersFromLocalStorage(),
        loading: false,
        error: null,
    },
    reducers: {
        deleteUser: (state, action) => {
            state.users = state.users.filter(user => user.id !== action.payload);
            saveUsersToLocalStorage(state.users);
        },
        addUser: (state, action) => {
            const newUser = {
                id: Date.now(),
                name: action.payload.name,
                email: action.payload.email,
            };
            state.users.push(newUser);
            saveUsersToLocalStorage(state.users);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUsers.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                saveUsersToLocalStorage(state.users); 
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { deleteUser, addUser } = userSlice.actions;
export default userSlice.reducer;
