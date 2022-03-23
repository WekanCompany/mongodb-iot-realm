import { useQuery } from "@apollo/client";
import {message} from 'antd';
import gql from "graphql-tag";

const useEdges = () => {
  const { edges, loading } = useAllEdges();
  return {
    loading,
    edges,
  };
};

export default useEdges;

function useAllEdges() {
  const { data, loading, error } = useQuery(
    gql`
      query {
        edges {
          _id
          edgeId
          edgeName
          compactSize
          sensors {
            _id
            sensorName
            sensorId
            sensorType
            threshold
            unit
          }
        }
      }
    `,
    { variables: {} }
  );
  if(loading){
    message.loading({content:'loading...', key:"loading"}, 2);
  }
  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  // If the query has finished, return the tasks from the result data
  // Otherwise, return an empty list
  let edges = data?.edges ?? [];
  return { edges, loading };
}
