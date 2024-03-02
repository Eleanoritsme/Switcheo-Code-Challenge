//Original Version
//Issues stated under this version
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
//Issue: two interface can be written in a more concise form because they have some same attributes such as currency and amount. 
//Potential Improvements: interface FormattedWalletBalance can be extended by WalletBalance.

class Datasource {
  // TODO: Implement datasource class
  // need to retreive the prices required
}

interface Props extends BoxProps {
  //Issue: Interface 'BoxProps' is missing. 
  //Improvement: Add interface 'BoxProps' and relevant properties.
}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  //Issue: useWalletBalances() is undefined.
  //Improvements: Defined useWalletBalances()
	const [prices, setPrices] = useState({});
  //Issue: useState is not imported.
  //Improvements: import { useState } from 'react'.

  useEffect(() => {
    //Issues: useEffect is not imported.
    //Improvements: import { useEffect } from 'react'.
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices().then(prices => {
      setPrices(prices);
    }).catch(error => {
      console.err(error); 
      //Issue: Incorrect method for displaying errors;
      //Improvements: The correct method should be: console.error();
    });
  }, []);

	//Issue: this function may have potential inefficiencies in repeatedly calling the getPriority().
  //Potential Improvements: 'storing' the getPriority() results to reduce redundant calculations for the same blockchain values.
  const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}


  const sortedBalances = useMemo(() => {
    //Issues: useMemo is not imported.
    //Improvements: import { useMemo } from 'react'.
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
      //Issue 1: Property 'blockchain' does not exist on type 'WalletBalance'.
      //Potential Improvements 1: Add property 'blockchain' into 'WalletBalance'.
      //Issue 2: Here getPriority() is called multiple times. If the getPriority() is in the original version, it will cause the computational overhead associated with the repreated execution of the 'switch' statement.
      //Potential Improvements 2: Memoizing getPriority results for efficiency.
		  if (lhsPriority > -99) { 
        //Issue: 'lhsPriority' has not been defined, leading to the reference error.
        //Potential Improvements: Probably change 'lhsPriority' to 'balancePriority' to check 'balancePriority' instead.
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
      //Issue: Property 'blockchain' does not exist on type 'WalletBalance'.
      //Potential Improvements: Add property 'blockchain' into 'WalletBalance'.
		  const rightPriority = getPriority(rhs.blockchain);
      //Issue: Property 'blockchain' does not exist on type 'WalletBalance'.
      //Potential Improvements: Add property 'blockchain' into 'WalletBalance'.
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
      //Issue: Missting the case when leftPriority = rightPriority
      //Improvements: Add the case when leftPriority = rightPriority and the return statement
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    //Issue: This mapping may be redundant with the next mapping as WalletBalance and FormattedWalletBalance have some same attributes.
    //Improvements: The mapping can be simplified and combined with the next mapping because there might be some itereations over the array.
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    //Issue: Redundant mapping as mentioned previously
    //Improvements: Combine these two mappings together, and formatting and calculating the usdusdValue in one step.
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row} 
        //Issue: classes.row does not have value in scope, it is undefined. 
        //Improvements: Either declare one or provide an initializer (import classes from...).
        key={index}
        //Issue: Using index may cause confusion when the list can change.
        //Improvements: Have a more unique key other than just index.
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}

