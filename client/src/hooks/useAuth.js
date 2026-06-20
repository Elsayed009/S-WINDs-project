import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from '../store/authSlice';
import { loginApi, logoutApi, getMeApi } from '../api/authApi';

const useAuth = () => {
    const dispatch = useDispatch();
    const {user, isAuthenticated, loading} = useSelector((state)=> state.auth);

    const login = async (credentials) => {
        const response = await loginApi(credentials);
        dispatch(setUser(response.data.user));
        return response;
    }


const logout = async ()=> {
    await logoutApi();
    dispatch(clearUser());
};

const loadUser = async () => {
    try{
        const response = await getMeApi();
        dispatch(setUser(response.data.user));
    }catch{
        dispatch(clearUser());
    }
};

return {user, isAuthenticated, loading, login, logout, loadUser}
};

export default useAuth;