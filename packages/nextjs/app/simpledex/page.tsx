"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
// import { useSessionStorage } from "usehooks-ts";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
// import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

// const selectedContractStorageKey = "scaffoldEth2.selectedContract";

const SimpleDEX: NextPage = () => {
  const contractsData = useAllContracts();
  const { address } = useAccount();
  const [tkaApproveInput, setTkaApproveInput] = useState(0);
  const [tkbApproveInput, setTkbApproveInput] = useState(0);
  const [liquidityAInput, setLiquidityAInput] = useState(0);
  const [liquidityBInput, setLiquidityBInput] = useState(0);
  const [removeLiquidityAInput, setRemoveLiquidityAInput] = useState(0);
  const [removeLiquidityBInput, setRemoveLiquidityBInput] = useState(0);
  const [swapA, setSwapA] = useState(0);
  const [swapB, setSwapB] = useState(0);
  const [text, setText] = useState("Approve Tokens to add liquidity");

  const simpleDex = contractsData["SimpleDEX"] as Contract<"SimpleDEX">;

  const { data: reserveA } = useScaffoldReadContract({
    contractName: "SimpleDEX",
    functionName: "reserveA",
    watch: true,
  });

  const { data: reserveB } = useScaffoldReadContract({
    contractName: "SimpleDEX",
    functionName: "reserveB",
    watch: true,
  });

  const { data: tokenA } = useScaffoldReadContract({
    contractName: "SimpleDEX",
    functionName: "tokenA",
    watch: true,
  });
  console.log(tokenA);
  const { data: allowanceA, isLoading: isLoadingAllowanceA } = useScaffoldReadContract({
    contractName: "TokenA",
    functionName: "allowance",
    args: [address, simpleDex.address],
    watch: true,
  });

  const { data: allowanceB, isLoading: isLoadingAllowanceB } = useScaffoldReadContract({
    contractName: "TokenB",
    functionName: "allowance",
    args: [address, simpleDex.address],
    watch: true,
  });

  const { writeContractAsync: writeTokenAAsync } = useScaffoldWriteContract("TokenA");
  const { writeContractAsync: writeTokenBAsync } = useScaffoldWriteContract("TokenB");
  const { writeContractAsync: writeSimpleDexAsync } = useScaffoldWriteContract("SimpleDEX");

  useEffect(() => {
    if ((!!reserveA && reserveA > 0 && !allowanceA) || (!!reserveB && reserveB > 0 && !allowanceB)) {
      setText("Approve tokens to interact with the contract");
    }
  }, [allowanceA, allowanceB, reserveA, reserveB]);

  const handleOnChangeLiquidityA: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void> = async event => {
    setLiquidityAInput(Number(event.target.value));
  };

  const handleOnChangeLiquidityB = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiquidityBInput(Number(event.target.value));
  };

  const handleOnChangeRemoveLiquidityA = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveLiquidityAInput(Number(event.target.value));
  };

  const handleOnChangeRemoveLiquidityB = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveLiquidityBInput(Number(event.target.value));
  };

  const handleOnSwapA = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwapA(Number(event.target.value));
  };

  const handleOnSwapB = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwapB(Number(event.target.value));
  };
  const handleAddLiquidity = async () => {
    try {
      await writeSimpleDexAsync({
        functionName: "addLiquidity",
        args: [BigInt(liquidityAInput), BigInt(liquidityAInput)],
      });
      alert("Liquidity added successfully");
    } catch (error) {
      console.error("Error adding liquidity:", error);
      alert("Failed to add liquidity");
    }
  };
  const handleApproveTKA = async () => {
    try {
      await writeTokenAAsync({
        functionName: "approve",
        args: [simpleDex.address, BigInt(tkaApproveInput)],
      });
      alert("TokenA approved successfully");
    } catch (error) {
      console.error("Error approving TokenA:", error);
      alert("Failed to approve TokenA");
    }
  };

  const handleRemoveLiquidity = async () => {
    try {
      await writeSimpleDexAsync({
        functionName: "removeLiquidity",
        args: [BigInt(removeLiquidityAInput), BigInt(removeLiquidityBInput)],
      });
      alert("Liquidity removed successfully");
    } catch (error) {
      console.error("Error removing liquidity:", error);
      alert("Failed to remove liquidity");
    }
  };
  const handleApproveTKB = async () => {
    try {
      await writeTokenBAsync({
        functionName: "approve",
        args: [simpleDex.address, BigInt(tkbApproveInput)],
      });
      alert("TokenA approved successfully");
    } catch (error) {
      console.error("Error approving TokenA:", error);
      alert("Failed to approve TokenA");
    }
  };

  const handleOnInputApproveTKAChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTkaApproveInput(Number(event.target.value));
  };
  const handleOnInputApproveTKBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTkbApproveInput(Number(event.target.value));
  };

  const handleOnSwapTKA = async () => {
    try {
      await writeSimpleDexAsync({
        functionName: "swapAforB",
        args: [BigInt(swapA)],
      });
      alert("TKA swapped successfully");
    } catch (error) {
      console.error("Error swapping TKA:", error);
      alert("Failed to swap TKA");
    }
  };

  const handleOnSwapTKB = async () => {
    try {
      await writeSimpleDexAsync({
        functionName: "swapBforA",
        args: [BigInt(swapB)],
      });
      alert("TKB swapped successfully");
    } catch (error) {
      console.error("Error swapping TKB:", error);
      alert("Failed to swap TKB");
    }
  };

  return (
    <div className="relative flex flex-col flex-1 px-4 py-2">
      <div className="flex justify-end">
        <ConnectButton label="Connect Wallet" />
      </div>
      <div>
        <p>Reserve A: {reserveA?.toString()}</p>
        <p>Reserve B: {reserveB?.toString()}</p>
      </div>
      <div>
        {(!allowanceA || !allowanceB) && <p>{text}</p>}
        <div className="flex flex-row justify-evenly">
          {!allowanceA && !isLoadingAllowanceA && (
            <div>
              <p>Approve TKA</p>
              <input
                type="numbers"
                placeholder="TokenA"
                className="input w-full max-w-xs"
                value={tkaApproveInput}
                onChange={handleOnInputApproveTKAChange}
              />
              <button className="btn btn-secondary mt-2" onClick={handleApproveTKA} disabled={!tkaApproveInput}>
                Approve
              </button>
            </div>
          )}
          {!allowanceB && !isLoadingAllowanceB && (
            <div>
              <p>Approve TKB</p>
              <input
                type="numbers"
                placeholder="TokenB"
                className="input w-full max-w-xs"
                value={tkbApproveInput}
                onChange={handleOnInputApproveTKBChange}
              />
              <button className="btn btn-secondary mt-2" onClick={handleApproveTKB} disabled={!tkbApproveInput}>
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
      <>
        <div className="flex flex-row justify-evenly">
          <div>
            <p>Add Liquidity TokenA</p>
            <input
              type="numbers"
              placeholder="TokenA"
              className="input w-full max-w-xs"
              value={liquidityAInput}
              onChange={handleOnChangeLiquidityA}
            />
          </div>
          <div>
            <p>Add Liquidity TokenB</p>
            <input
              type="numbers"
              placeholder="TokenB"
              className="input w-full max-w-xs"
              value={liquidityBInput}
              onChange={handleOnChangeLiquidityB}
            />
          </div>
        </div>
        <button
          className="btn btn-secondary mt-2"
          onClick={handleAddLiquidity}
          disabled={!liquidityAInput || !liquidityBInput}
        >
          Add Liquidity
        </button>
      </>
      <>
        <div className="flex flex-row justify-evenly">
          <div>
            <p>Remove Liquidity TokenA</p>
            <input
              type="numbers"
              placeholder="TokenA"
              className="input w-full max-w-xs"
              value={removeLiquidityAInput}
              onChange={handleOnChangeRemoveLiquidityA}
            />
          </div>
          <div>
            <p>Remove Liquidity TokenB</p>
            <input
              type="numbers"
              placeholder="TokenB"
              className="input w-full max-w-xs"
              value={removeLiquidityBInput}
              onChange={handleOnChangeRemoveLiquidityB}
            />
          </div>
        </div>
        <button
          className="btn btn-secondary mt-2"
          onClick={handleRemoveLiquidity}
          disabled={!removeLiquidityAInput || !removeLiquidityBInput}
        >
          Remove Liquidity
        </button>
      </>
      <div className="flex flex-row justify-evenly">
        <div>
          <p>Swap TKA-TKB</p>
          <input
            type="numbers"
            placeholder="TokenA"
            className="input w-full max-w-xs"
            value={swapA}
            onChange={handleOnSwapA}
          />
          <button className="btn btn-secondary mt-2" onClick={handleOnSwapTKA} disabled={!swapA}>
            Swap TKA-TKB
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-evenly">
        <div>
          <p>Swap TKB-TKA</p>
          <input
            type="numbers"
            placeholder="TokenA"
            className="input w-full max-w-xs"
            value={swapB}
            onChange={handleOnSwapB}
          />
          <button className="btn btn-secondary mt-2" onClick={handleOnSwapTKB} disabled={!swapB}>
            Swap TKB-TKA
          </button>
        </div>
      </div>
    </div>
  );
};
export default SimpleDEX;
