import { Alert, CheckCircle } from "@kiwicom/orbit-components/lib/icons";
import Tooltip from "@kiwicom/orbit-components/lib/Tooltip";
import { EndpointMockValidityEnum } from "../utils/types";

type EndpointMockValidityIconProps = {
  validity: EndpointMockValidityEnum | string;
};

const EndpointMockValidityIcon = ({
  validity,
}: EndpointMockValidityIconProps): JSX.Element => {
  const isValid = validity === EndpointMockValidityEnum.VALID;
  const isWithoutSchema = validity === EndpointMockValidityEnum.WITHOUT_SCHEMA;
  return (
    <Tooltip placement="top" content={validity}>
      {isValid ? (
        <CheckCircle color="success" />
      ) : (
        <Alert color={isWithoutSchema ? "warning" : "critical"} />
      )}
    </Tooltip>
  );
};

export default EndpointMockValidityIcon;
