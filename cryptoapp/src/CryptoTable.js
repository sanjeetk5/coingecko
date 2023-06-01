import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

const CryptoTable = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}`
        );
        setCoins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, [currency]);

  // Pagination
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = coins.slice(indexOfFirstCoin, indexOfLastCoin);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Sort
  const handleSort = () => {
    const sortedCoins = [...coins];
    if (sortOrder === "asc") {
      sortedCoins.sort((a, b) => a.market_cap - b.market_cap);
      setSortOrder("desc");
    } else {
      sortedCoins.sort((a, b) => b.market_cap - a.market_cap);
      setSortOrder("asc");
    }
    setCoins(sortedCoins);
  };

  return (
    <Box w={"90%"} m={"auto"}>
      <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </Select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Box m={"auto"} w={"80%"}>
          <Table bg={"black"} color={"white"} m={"auto"} w={"70%"}>
            <Thead bg={"yellow"} color={"red"}>
              <Tr>
                <Th>Coin</Th>

                <Th>
                  <button
                    type="button"
                    className="sort-button"
                    onClick={handleSort}
                  >
                    Market Cap {sortOrder === "asc" ? "↑up" : "↓down"}
                  </button>
                </Th>
                <Th>Current Price</Th>
                <Th>Price Change 24h (%)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentCoins.map((coin, i) => (
                <Tr onClick={onOpen} key={i}>
                  <Box display={"flex"}>
                    <Box>
                      <td>
                        <img
                          src={coin.image}
                          alt={coin.name}
                          style={{ width: "30px" }}
                        />
                      </td>
                    </Box>
                    <Box>
                      <Box>{coin.name}</Box>

                      <Box textAlign={"left"}>{coin.symbol}</Box>
                    </Box>
                  </Box>

                  <td>{coin.market_cap}</td>
                  <td>{coin.current_price}</td>
                  <td>{coin.price_change_percentage_24h.toFixed(2)}%</td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Box>
            {Array.from({ length: Math.ceil(coins.length / coinsPerPage) }).map(
              (_, index) => (
                <Button
                  color={"white"}
                  borderRadius={"5px"}
                  m={4}
                  bg={"black"}
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Button>
              )
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CryptoTable;
