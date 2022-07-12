import React, {lazy,Suspense} from "react";
import {Route, Routes} from 'react-router-dom'
import Spinner from "./Spinner";
import NotFound from "./notFound";

const AssignmentList = lazy(()=>import("./assignmentList"))
const AssignmentCreate = lazy(()=>import("./assignmentCreate"))
const Login = lazy(()=>import("./login"))
const PostDetails = lazy(()=>import("./assignmentDetails"))
const Profile = lazy(()=>import("./profile"))
const Registration = lazy(()=>import("./registration"))

const BaseRouter = () => {
    return ( 
    <div>
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route exact path="/" element={<AssignmentList />} />
                <Route exact path="/create-assignment" element={<AssignmentCreate />} />
                <Route exact path="/register" element={<Registration />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/:id" element={<PostDetails />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    </div> 
    );
}
 
export default BaseRouter;