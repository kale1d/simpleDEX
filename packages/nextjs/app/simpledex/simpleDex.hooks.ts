"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Contract } from "~~/utils/scaffold-eth/contract";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

export const useSimpleDex = () => {
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
  return {
    handleAddLiquidity,
    handleApproveTKA,
    handleApproveTKB,
    handleOnInputApproveTKAChange,
    handleOnInputApproveTKBChange,
    handleOnSwapTKA,
    handleOnSwapTKB,
    handleOnSwapA,
    handleOnSwapB,
    handleRemoveLiquidity,
    handleOnChangeLiquidityA,
    handleOnChangeLiquidityB,
    handleOnChangeRemoveLiquidityA,
    handleOnChangeRemoveLiquidityB,
    allowanceA,
    allowanceB,
    isLoadingAllowanceA,
    isLoadingAllowanceB,
    reserveA,
    reserveB,
    swapA,
    swapB,
    text,
    tkaApproveInput,
    tkbApproveInput,
    liquidityAInput,
    liquidityBInput,
    removeLiquidityAInput,
    removeLiquidityBInput,
  };
};
