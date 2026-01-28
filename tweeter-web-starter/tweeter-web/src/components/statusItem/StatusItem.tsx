import { Link } from "react-router-dom";
import Post from "./Post";
import { Status } from "tweeter-shared/dist/model/domain/Status";
import { useUserNavigate } from "../NavigateHook";

interface Props {
        status: Status;
        featureUrl: string;
}

const StatusItem = (props: Props) => {
    const { navigateToUser } = useUserNavigate();

    return (
        <div className="col bg-light mx-0 px-0">
            <div className="container px-0">
                <div className="row mx-0 px-0">
                    <div className="col-auto p-3">
                    <img
                        src={props.status.user.imageUrl}
                        className="img-fluid"
                        width="80"
                        alt="Posting user"
                    />
                    </div>
                    <div className="col">
                        <h2>
                            <b>
                            {props.status.user.firstName} {props.status.user.lastName}
                            </b>{" "}
                            -{" "}
                            <Link
                            to={`/feed/${props.status.user.alias}`}
                            onClick={(event) => navigateToUser(event, "/feed")}
                            >
                            {props.status.user.alias}
                            </Link>
                        </h2>
                        {props.status.formattedDate}
                        <br />
                        <Post status={props.status} featurePath="/feed" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatusItem;