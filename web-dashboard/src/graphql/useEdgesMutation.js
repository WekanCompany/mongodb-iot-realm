import { useMutation } from "@apollo/client";
import {message} from 'antd';
import gql from "graphql-tag";

export default function useEdgeMutation() {
  return {
    updateEdge: useUpdateEdge(),
  };
}

const UpdateEdgeMutation = gql`
  mutation($edgeId: ObjectId!, $updates: EdgeUpdateInput!) {
    updateOneEdge(query: { _id: $edgeId }, set: $updates) {
      _id
      edgeName
      compactSize
    }
  }
`;

function useUpdateEdge() {
  const [updateEdgeMutation] = useMutation(UpdateEdgeMutation);
  const updateEdge = async (edge, updates) => {
    message.loading('updating...', 1);
    const { t } = await updateEdgeMutation({
      variables: { edgeId: edge._id, updates },
    });
    message.success("Updated Successfully")
    return t;
  };
  return updateEdge;
}
