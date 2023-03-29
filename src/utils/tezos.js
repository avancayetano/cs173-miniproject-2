import { TezosToolkit } from "@taquito/taquito";
import { wallet } from "./wallet";

export const tezos = new TezosToolkit("https://limanet.smartpy.io");

tezos.setWalletProvider(wallet);
