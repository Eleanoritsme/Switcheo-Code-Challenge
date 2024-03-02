//Refactored Version

import React, { useState, useEffect, useMemo } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
//Improvement: Adding the missing property 'blockchain' into interface 'WalletBalance'.
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
//Improvement: extend FormattedWalletBalance by WalletBalance, sharing the same properties.

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<{ [currency: string]: number }> {
    try {
      const response = await fetch(this.url);
      const data: any[] = await response.json();
      const prices: { [currency: string]: number } = {};
      
      data.forEach(item => {
        prices[item.currency] = item.price;
      });

      return prices;
    } catch (error) {
      console.error('Failed to fetch prices:', error);
      throw error;
    }
  }
}

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Props extends BoxProps {
  //Issue: Interface 'BoxProps' is missing. 
  //Improvement: Add interface 'BoxProps' and relevant properties.
}

const WalletPage: React.FC<Props> = ({ ...rest }) => {
  const balances = useWalletBalances();
  //Issue: useWalletBalances() is undefined.
  //Improvements: Defined useWalletBalances()
	const [prices, setPrices] = useState({});
  //Improvements: import { useState } from 'react'.

  useEffect(() => {
    //Improvements: import { useEffect } from 'react'.
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices().then(prices => {
      setPrices(prices);
    }).catch(error => {
      console.error(error); 
      //Improvements: The correct method should be: console.error();
    });
  }, []);

	//Issue: this function may have potential inefficiencies in repeatedly calling the getPriority().
  //Potential Improvements: 'storing' the getPriority() results to reduce redundant calculations for the same blockchain values.
  const getPriority = (blockchain: any): number => {
	  const priorities = {
      'Osmosis': 100,
      'Ethereum': 50,
      'Arbitrum': 30,
      'Zilliqa': 20,
      'Neo': 20,
    };
    return priorities[blockchain] || -99;
	}


  const sortedBalances = useMemo(() => {
    //Improvements: import { useMemo } from 'react'.
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
      //Improvement: Add property 'blockchain' into 'WalletBalance'.
      return balancePriority > -99 && balance.amount > 0;
      //Improvement: Probably change 'lhsPriority' to 'balancePriority' to check 'balancePriority' instead.
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      //Improvement: Memoizing getPriority results for efficiency.
			const leftPriority = getPriority(lhs.blockchain);
      //Improvement: Add property 'blockchain' into 'WalletBalance'.
		  const rightPriority = getPriority(rhs.blockchain);
      //Improvements: Add property 'blockchain' into 'WalletBalance'.
      // return rightPriority - leftPriority;
      return rightPriority - leftPriority;
      //Improvement: Cover all cases of the relationship between righPriority and leftPriority.
    });
  }, [balances, prices]);


  
  const rows = sortedBalances.map((balance: WalletBalance, index: number) => {
    const formatted = balance.amount.toFixed();
    const usdValue = prices[balance.currency] * balance.amount;
    //Improvements: Combine two mappings together, formatting and calculating the usdusdValue in one step.
    
    return (
      <WalletRow 
        className={classes.row} 
        //Issue: classes.row does not have value in scope, it is undefined. 
        //Improvements: Either declare one or provide an initializer (import classes from...).
        key={balance.currency + index}
        //Improvement: Have a more unique key other than just index.
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

