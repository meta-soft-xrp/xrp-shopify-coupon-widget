import { useEffect, useState, useContext } from "react";
import {
  Box,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Image,
  Heading,
  Grid,
  GridItem,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import useXRPStore from "../../store/xrpl";
import DiscountModal from "./discount";
import { ShopContext } from "../../context";

const XrpModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [buyyerAddress, setBuyyerAddress] = useState("");
  const shop = useContext(ShopContext);
  const xrpPaymentState = useXRPStore((state) => state.xrpPaymentState);
  const postXRPpayment = useXRPStore((state) => state.postXRPpayment);
  const postXummPayment = useXRPStore((state) => state.postXummPayment);
  const verifyXummPayment = useXRPStore((state) => state.verifyXummPayment);
  const resetXRPPaymentState = useXRPStore(
    (state) => state.resetXRPPaymentState
  );
  const toast = useToast();

  const submitHandler = () => {
    const XRPbuyerAddress = buyyerAddress;
    if (XRPbuyerAddress.length === 0) {
      return;
    } else {
      postXRPpayment({ XRPbuyerAddress });
    }
  };

  const onModalClose = () => {
    resetXRPPaymentState();
    onClose();
  };

  const onPayClick = async ({ lookId }) => {
    onOpen();
    const data = await postXummPayment({ lookId, shop });

    const client = new WebSocket(data.status);

    client.onopen = () => {
      console.log("Connected.....");
    };

    client.onmessage = async (e) => {
      const newObj = await JSON.parse(e.data);
      console.log(e.data, newObj);
      console.log(newObj.txid);
      const txid = await newObj.txid;
      console.log(txid);
      if (txid !== undefined) {
        const resp = await verifyXummPayment({ txid });
      }
    };
  };

  const renderPaymentStatus = () => {
    if (xrpPaymentState.post.loading) {
      // return <SkeletonText mt="4" noOfLines={4} spacing="4" />;

      return (
        <>
          <Box minH={"100px"} width="20%" m="auto" p={5}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            ;
          </Box>
        </>
      );
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
      const { result } = xrpPaymentState.post.success.data;
      if (result.error) {
        toast({
          title: "XRP Error.",
          description: result.error_message,
          status: "error",
          isClosable: true,
        });
        return (
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {result.error}
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {result.error_message}
            </AlertDescription>
          </Alert>
        );
      } else {
        return <DiscountModal />;
      }
    } else {
      return (
        <Box p={10}>
          <Grid gap={6}>
            <GridItem>
              <Heading size="xl" fontWeight="bold" textAlign="center">
                {props.lookName}
              </Heading>
              <Text size="lg" textAlign="center">
                {props.lookXrpPrice ? props.lookXrpPrice : "0"} XRP
              </Text>
            </GridItem>
            <GridItem alignContent={"center"}>
              <Center width={"100%"}>
                <Image
                  border={"2px"}
                  src={xrpPaymentState.post.success?.data?.qr}
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
        Pay {props.lookXrpPrice ? props.lookXrpPrice : "0"} XRP to get 100% off
      </Button>

      <Modal isOpen={isOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader colorScheme="blue.500">Open Xumm App</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{renderPaymentStatus()}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default XrpModal;
