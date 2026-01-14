import { useState } from 'react';
import { updateUser } from '../services/api';

export default function UserUpdate() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await updateUser(email, {firstName, lastName, idNumber});
            alert( `Update: ${res.data.firstName} ${res.data.lastName} ${res.data.idNumber}`);
        } catch (err) {
            alert(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    return(
    <form onSubmit = {submit} style = {{display : 'grid', gap : 8}}>
        <input placeholder = 'UP Email' value = {email} onChange = {(e) => setEmail(e.target.value)}/>
        <input placeholder = 'Update First Name' value = {firstName} onChange = {(e) => setFirstName(e.target.value)}/>
        <input placeholder = 'Update Last Name' value = {lastName} onChange = {(e) => setLastName(e.target.value)}/>
        <input placeholder = 'Update ID Number' value = {idNumber} onChange = {(e) => setIdNumber(e.target.value)}/>
        <button type = "submit" disabled = {loading}>{loading ? 'Updating...' : 'Update User'}</button>
    </form>
    );
}