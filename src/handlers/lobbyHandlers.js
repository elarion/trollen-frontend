import { logoutUser } from '../store/authSlice';
import axiosInstance from '../utils/axiosInstance';

export const handleLogout = async (dispatch, navigation) => {
    await dispatch(logoutUser()).unwrap();
    navigation.reset({ index: 0, routes: [{ name: "SignIn" }] });
};

export const goToScreen = (navigation, screenName) => {
    navigation.navigate(screenName);
};

export const goToCreateRoom = async (
    user,
    roomname,
    tag,
    capacityValue,
    isSafe,
    is,
    password,
    setRoomname,
    setPassword,
    setTag,
    setCapacityValue,
    setSafe,
    set,
    setModalRoomCreationVisible,
    navigation
) => {
    try {
        const response = await axiosInstance.post(`/rooms/create`, {
            user: user.tokenDecoded.id,
            room_socket_id: 'a',
            name: roomname,
            tags: tag,
            settings: { max: capacityValue, is_safe: isSafe, is_: is, password: password },
        });

        if (response.data) {
            setRoomname('');
            setPassword('');
            setTag('');
            setCapacityValue('0');
            setSafe(false);
            set(false);
            setModalRoomCreationVisible(false);
            navigation.navigate('Room', { roomId: response.data.room._id });
        }
    } catch (error) {
        console.error("Erreur lors de la création :", error);
    }
};