import { TezosToolkit } from "@taquito/taquito";
import { wallet, network } from "./wallet";

export const tezos = new TezosToolkit(`https://${network}.smartpy.io`);

tezos.setWalletProvider(wallet);
