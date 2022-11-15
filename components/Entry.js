import { abi, contractAddress } from "../constants" // [TODO] chainId
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { Input } from "@web3uikit/core";
import { Button } from "@web3uikit/core";
import { ethers } from "ethers"


export default function Entry() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // const raffleAddress = ""
    var forecastRate = 1.0
    var forecast = 0
    // const entranceFee = 10000000000000000

    // const [lastUpdatedAt, setLastUpdatedAt] = useState("0")
    const [entranceFee, setEntranceFee] = useState("0")
    const [lastUnemploymentRate, setLastUnemploymentRate] = useState("0")
    const [numberOfLastWinners, setNumberOfLastWinners] = useState("0")
    const [lastRewardPerPerson, setLastRewardPerPerson] = useState("0")

    const dispatch = useNotification()


    var eventOptions = {
        abi: abi,
        contractAddress: contractAddress,
        functionName: "bet",
        msgValue: entranceFee,
        params: {
            _forecastValue: forecast
        },
    };

    const { runContractFunction, isFetching, isLoading } = useWeb3Contract();

    // const { runContractFunction: bet } = useWeb3Contract();//[TODO]???

    // const {
    //     runContractFunction: bet,
    //     data: enterTxResponse,
    //     isLoading,
    //     isFetching,
    // } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: contractAddress,
    //     functionName: "bet",
    //     msgValue: entranceFee,
    //     params: {
    //         _forecastValue: forecast,
    //     },
    // })

    /* View Functions */
    // const { runContractFunction: getLastUpdatedAt } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: contractAddress,
    //     functionName: "getLastUpdatedAt",
    //     params: {},
    // })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getLastUnemploymentRate } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getLastUnemploymentRate",
        params: {},
    })

    const { runContractFunction: getNumberOfLastWinners } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getNumberOfLastWinners",
        params: {},
    })

    const { runContractFunction: getLastRewardPerPerson } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "getLastRewardPerPerson",
        params: {},
    })

    // var options = {
    //     abi: abi,
    //     contractAddress: contractAddress,
    //     functionName: "",
    //     params: {},
    // }
    async function updateUIValues() {
        // const lastUpdatedAtFromCall = (await getLastUpdatedAt())

        // const entranceFeeFromCall = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     options,
        // })
        // options.functionName = "getEntranceFee"
        // const entranceFeeFromCall = (await runContractFunction({
        //     params: options,
        // }))
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const lastUnemploymentRateFromCall = (await getLastUnemploymentRate()).toString()
        const numberOfLastWinnersFromCall = (await getNumberOfLastWinners()).toString()
        const rewardObj = (await getLastRewardPerPerson())
        const lastRewardPerPersonFromCall = rewardObj ? rewardObj.toString() : "N/A"
        // console.log("from call: ", entranceFeeFromCall, lastRewardPerPersonFromCall)
        // setLastUpdatedAt(lastUpdatedAtFromCall)
        setEntranceFee(entranceFeeFromCall)
        setLastUnemploymentRate(lastUnemploymentRateFromCall)
        setNumberOfLastWinners(numberOfLastWinnersFromCall)
        setLastRewardPerPerson(lastRewardPerPersonFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
            // console.log("something is running", entranceFee, contractAddress, abi)
        }
    }, [isWeb3Enabled])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div>
            <div>
                <Input
                    description="your predicted value of unemployment rate."
                    label="Please enter value between 0.0 and 25.0."
                    onBlur={function noRefCheck() { }}
                    onChange={function noRefCheck() { }}
                    validation={{
                        required: true
                    }}
                    id="rateValue"
                />
                <br />
            </div>
            <br />
            <div>
                <Button
                    onClick={async () => {
                        forecastRate = document.getElementById("rateValue").value;
                        forecast = forecastRate * 10;

                        eventOptions.params._forecastValue = forecast;
                        // console.log(forecast, isLoading, isFetching, eventOptions, eventOptions.contractAddress, eventOptions.functionName, eventOptions.params._forecastValue);
                        await runContractFunction({
                            params: eventOptions,
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        });

                        // options.functionName = "getEntranceFee"
                        // const temp = (await runContractFunction({
                        //     params: options,
                        // }));
                        // console.log("temp is ", temp);

                        // await bet({
                        //     // onComplete:
                        //     // onError:
                        //     onSuccess: console.log("ok"),//handleSuccess,
                        //     onError: (error) => console.log(error),
                        // });
                    }
                    }
                    disabled={isLoading || isFetching}
                    text="Submit your prediction"
                    theme="primary"
                />
                <br />
                <div>the entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                <div>last unemployment rate: {lastUnemploymentRate / 10}</div>
                <div>the number of last winners: {numberOfLastWinners}</div>
                <div>the last reward per person: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
            </div>
        </div>

    )
}