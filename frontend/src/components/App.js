import React from "react";
import "./App.css";

import { ethers } from "ethers";
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Greeter } from "./Greeter";

import GreeterArtifact from "../contracts/Greeter.json";
import contractAddress from "../contracts/contract-address.json";

const HARDHAT_NETWORK_ID = "31337";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAddress: undefined,
      balance: undefined,
      fetchedGreeting: undefined,

      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          Connected: {this.state.selectedAddress}
          <br />
          ETH Balance: {this.state.balance}
          <br />
          Contract: {this._greeter.address}
          <br />
          <br />
          <Greeter
            fetchedGreeting={this.state.fetchedGreeting}
            fetchGreeting={() => this._fetchGreeting()}
            setGreeting={(msg) => this._setGreeting(msg)}
          />
        </header>
      </div>
    );
  }

  async _fetchGreeting() {
    const data = await this._greeter.greet();
    console.log(data);

    this.setState({ fetchedGreeting: data });
  }

  async _setGreeting(msg) {
    const tx = await this._greeter.setGreeting(msg);
    tx.wait();
    console.log("Set Greeting tx done");
  }

  async _initializeGreeter() {
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
      this._greeter = new ethers.Contract(
        contractAddress.Greeter,
        GreeterArtifact.abi,
        this._provider.getSigner(0)
      );
    } catch (error) {
      console.log(error);
    }
  }

  _resetState() {
    this.setState(this.initialState);
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({
      networkError: "Please connect Metamask to Localhost:8545",
    });

    return false;
  }

  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  _initialize(userAddress) {
    this.setState({
      selectedAddress: userAddress,
    });

    this._initializeGreeter();
  }

  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    let balance = await this._provider.getBalance(selectedAddress);
    balance = ethers.utils.formatEther(balance);
    this.setState({ balance });

    window.ethereum.on("accountsChanged", ([newAddress]) => {
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    window.ethereum.on("chainChanged", ([networkId]) => {
      this._resetState();
    });
  }

  componentDidMount() {}
  componentWillUnmount() {}
}
