import { useEffect, useState, useContext } from "react";
import {
  Box,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalHeader,
  useBreakpointValue,
  Input,
  SkeletonText,
  Alert,
  AlertIcon,
  Image,
  Img,
  Heading,
  Grid,
  GridItem,
  ChakraProvider,
  chakra,
  ControlBox,
  Center,
} from "@chakra-ui/react";
import useLooksStore from "../../store/looks";
import useXRPStore from "../../store/xrpl";
import DiscountModal from "./discount";
import { ShopContext } from "../../context";
const XrpModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [buyyerAddress, setBuyyerAddress] = useState("");
  const [productId, setProductId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const shop = useContext(ShopContext);
  const xrpPaymentState = useXRPStore((state) => state.xrpPaymentState);
  const postXRPpayment = useXRPStore((state) => state.postXRPpayment);
  const postXummPayment = useXRPStore((state) => state.postXummPayment);
  const resetXRPPaymentState = useXRPStore(
    (state) => state.resetXRPPaymentState
  );
  

  const submitHandler = () => {
    const XRPbuyerAddress = buyyerAddress;
    if (XRPbuyerAddress.length === 0) {
      return;
    } else {
      postXRPpayment({ XRPbuyerAddress });
      // setQrCode(xrpPaymentState.post.success.data);
    }
  };

  const onModalClose = () => {
    resetXRPPaymentState();
    onClose();
  };

  const onPayClick = ({ lookId }) => {
    postXummPayment({ lookId, shop });

    onOpen();
  };

  const renderPaymentStatus = () => {
    if (xrpPaymentState.post.loading) {
      return <SkeletonText mt="4" noOfLines={4} spacing="4" />;
    } else if (xrpPaymentState.post.failure.error) {
      return (
        <>
          <Text>Your XRP Address</Text>
          <Input
            placeholder="XRP address "
            size="md"
            onChange={(e) => {
              setBuyyerAddress(e.target.value);
            }}
          />
          <Button colorScheme="blue" onClick={submitHandler} mt={3} isFullWidth>
            Pay
          </Button>
          <Alert status="error">
            <AlertIcon />
            {xrpPaymentState.post.failure.message}
          </Alert>
          <Text>{xrpPaymentState.post.failure.message}</Text>
        </>
      );
    } else if (xrpPaymentState.post.success.ok) {
      return <DiscountModal />;
    } else {
      return (
        <Box p={10}>
          <Grid gap={6}>
            <GridItem>
              
                <Heading size="xl" fontWeight="bold">
                  {props.lookName}
                </Heading>
                <Text>{props.lookPrice ? props.lookPrice : "100"} XRP</Text>
             
            </GridItem>
            <GridItem alignContent={"center"}>
              <Center width={"100%"}>
                <Image
                  border={"2px"}
                  src={xrpPaymentState.post.success.data}
                  width="200px"
                />
              </Center>
            </GridItem>
            <GridItem>
              <Center>
                <Text>
                  Please scan the QR code with XUMM on your smartphone.
                </Text>
              </Center>
            </GridItem>
          </Grid>
        </Box>
      );
    }
  };

  return (
    <>
      <Button
        onClick={() =>
          onPayClick({
            lookId: props.lookId,
          })
        }
        isFullWidth
      >
        Pay {props.lookPrice ? props.lookPrice : "100"} XRP for % discount
      </Button>

      <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="messenger.500" color="#fff">
            Open xApp
          </ModalHeader>
          <ModalBody>{renderPaymentStatus()}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default XrpModal;
