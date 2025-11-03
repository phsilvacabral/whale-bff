import axios from 'axios';

const CRYPTO_API_URL = 'https://cryptofunctionapp.azurewebsites.net/api/GetTopCryptos?code=rersnTy_gAAOIV0TPlNZfdxwNbmMULtoO92O8ipDTehlAzFuBtAtYg==';

// Mapeamento de símbolos para informações das criptomoedas
const CRYPTO_INFO = {
  'BTCUSDT': {
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    market_cap_rank: 1
  },
  'USDCUSDT': {
    name: 'USD Coin',
    symbol: 'USDC',
    image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
    market_cap_rank: 2
  },
  'ETHUSDT': {
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    market_cap_rank: 3
  },
  'BNBUSDT': {
    name: 'BNB',
    symbol: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    market_cap_rank: 4
  },
  'SOLUSDT': {
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    market_cap_rank: 5
  },
  'FDUSDUSDT': {
    name: 'First Digital USD',
    symbol: 'FDUSD',
    image: 'https://assets.coingecko.com/coins/images/31079/large/firstdigitalusd.png',
    market_cap_rank: 6
  },
  'XRPUSDT': {
    name: 'XRP',
    symbol: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    market_cap_rank: 7
  },
  'ASTERUSDT': {
    name: 'Aster',
    symbol: 'ASTER',
    image: 'https://assets.coingecko.com/coins/images/32958/large/aster.png',
    market_cap_rank: 8
  },
  'USDEUSDT': {
    name: 'USD Euro',
    symbol: 'USDE',
    image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    market_cap_rank: 9
  },
  'DOGEUSDT': {
    name: 'Dogecoin',
    symbol: 'DOGE',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    market_cap_rank: 10
  },
  'ZECUSDT': {
    name: 'Zcash',
    symbol: 'ZEC',
    image: 'https://assets.coingecko.com/coins/images/486/large/circle-zcash-color.png',
    market_cap_rank: 11
  },
  'XPLUSDT': {
    name: 'XPLUS',
    symbol: 'XPLUS',
    image: 'https://assets.coingecko.com/coins/images/32958/large/aster.png',
    market_cap_rank: 12
  }
};

/**
 * @swagger
 * /api/crypto/top:
 *   get:
 *     summary: Busca as principais criptomoedas
 *     description: Retorna dados das top 12 criptomoedas em tempo real
 *     tags: [Crypto]
 *     responses:
 *       200:
 *         description: Lista de criptomoedas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       symbol:
 *                         type: string
 *                       image:
 *                         type: string
 *                       current_price:
 *                         type: number
 *                       market_cap_rank:
 *                         type: number
 *                       market_cap:
 *                         type: number
 *                       total_volume:
 *                         type: number
 *                       price_change_percentage_24h:
 *                         type: number
 *       500:
 *         description: Erro interno do servidor
 */
export const getTopCryptos = async (req, res) => {
  try {
    console.log('Buscando dados das criptomoedas...');
    
    const response = await axios.get(CRYPTO_API_URL, {
      timeout: 10000, // 10 segundos de timeout
      headers: {
        'User-Agent': 'Whale-BFF/1.0'
      }
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Formato de dados inválido da API');
    }

    // Processar os dados da API - formato: ["BTCUSDT","107120.00000000","ETHUSDT","3898.97000000",...]
    const cryptos = [];
    const data = response.data;
    
    console.log('Dados recebidos da API:', data);
    
    for (let i = 0; i < data.length; i += 2) {
      const symbol = data[i];
      const price = parseFloat(data[i + 1]);
      
      if (CRYPTO_INFO[symbol]) {
        const cryptoInfo = CRYPTO_INFO[symbol];
        
        cryptos.push({
          id: symbol.toLowerCase().replace('usdt', ''),
          name: cryptoInfo.name,
          symbol: cryptoInfo.symbol.toLowerCase(),
          image: cryptoInfo.image,
          current_price: price,
          market_cap_rank: cryptoInfo.market_cap_rank,
          // Dados simulados para campos não disponíveis na API
          market_cap: price * 1000000, // Simulação baseada no preço
          total_volume: price * 100000, // Simulação baseada no preço
          price_change_percentage_24h: (Math.random() - 0.5) * 10 // Simulação de variação
        });
      } else {
        console.log(`Símbolo não encontrado no mapeamento: ${symbol}`);
      }
    }

    console.log(`Processadas ${cryptos.length} criptomoedas`);

    res.json({
      success: true,
      data: cryptos,
      timestamp: new Date().toISOString(),
      count: cryptos.length
    });

  } catch (error) {
    console.error('Erro ao buscar dados das criptomoedas:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar dados das criptomoedas',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
