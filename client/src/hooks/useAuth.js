import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from '../store/authSlice';
import { loginApi, logoutApi, getMeApi } from '../api/authApi';

const useAuth = () => {
    const dispatch = useDispatch();
    const {user, isAuthenticated, loading} = useSelector((state)=> state.auth);

    const login = async (credentials) => {
        const response = await loginApi(credentials);
    }
}