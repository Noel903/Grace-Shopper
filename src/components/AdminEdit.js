import { Link, useHistory, useParams } from 'react-router-dom';
import AdminEditPost from './AdminEditPost';

const AdminEdit = ({products, token}) => {

    return (
        <>
        { 
        products?.map((product) => {
            return <AdminEditPost product={product} token={token}/>
            
        })
        }
        </>
        );
        }
    

export default AdminEdit;