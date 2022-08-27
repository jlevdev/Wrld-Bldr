import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import { useNavigate } from "react-router-dom";

export default function SignOut() {
	let navigate = useNavigate();

	useEffect(() => {
		const response = axiosInstance.post('auth/blacklist/', {
			refresh_token: localStorage.getItem('refresh_token'),
		});
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		axiosInstance.defaults.headers['Authorization'] = null;
		navigate('/signin');
	});
	return <div>Logout</div>;
}