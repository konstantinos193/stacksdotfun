(define-constant PLATFORM_TREASURY 'your_treasury_address)
(define-constant EMERGENCY_STOP_ADDRESS 'emergency_stop_address)

(define-data-var emergency-stop bool false)

;; Define Token Data Structure
(define-map tokens 
  (token-id uint) ;; unique ID for each token
  (tuple 
    (creator principal)
    (name (string-utf8 32))
    (symbol (string-utf8 8))
    (total-supply uint)
    (market-cap uint)
    (start-price uint) ;; Price of the token at launch
    (creator-allocated-tokens uint) ;; Number of tokens allocated to the creator
    (creator-purchased bool) ;; Whether the creator has purchased their allocated tokens
  ))

(define-map balances 
  (principal) ;; user address
  (token-id uint) ;; token ID
  uint) ;; user balance

;; Launch Token Function
(define-public (launch-token (name (string-utf8 32)) (symbol (string-utf8 8)) 
                             (market-cap uint) (stx-price uint) (creator-allocated-tokens uint))
  (let (
        (token-id (+ (var-get next-token-id) u1)) ;; Incrementing the token ID
        (start-price (/ market-cap 2500000)) ;; Initial price per token (market cap / supply)
        (total-supply u21000000) ;; Set total supply to 21 million tokens
        (creator-stx-amount (* creator-allocated-tokens start-price))
       )
    (begin
      (set-var next-token-id (+ (var-get next-token-id) u1)) ;; Increment token ID counter
      (map-set tokens token-id 
               (tuple (creator tx-sender) 
                      (name name)
                      (symbol symbol)
                      (total-supply total-supply)
                      (market-cap market-cap)
                      (start-price start-price)
                      (creator-allocated-tokens creator-allocated-tokens)
                      (creator-purchased false))) ;; Mark that the creator hasn't bought tokens yet
      (if (> creator-allocated-tokens u0)
        (begin
          (asserts! (is-eq (stx-get-transfer-amount) creator-stx-amount) (err u101))
          (unwrap! (stx-transfer? creator-stx-amount PLATFORM_TREASURY) (err u102))
          (map-set balances tx-sender token-id creator-allocated-tokens)
          (map-set tokens token-id (tuple (creator tx-sender) 
                                                    (name name)
                                                    (symbol symbol)
                                                    (total-supply total-supply)
                                                    (market-cap market-cap)
                                                    (start-price start-price)
                                                    (creator-allocated-tokens creator-allocated-tokens)
                                                    (creator-purchased true))))
        )
      )
    )
  )
)

;; Buy Token Function
(define-public (buy-token (token-id uint) (amount uint))
  (let ((token (unwrap! (map-get? tokens { token-id: token-id }) (err u103))))
    (begin
      (asserts! (get creator-purchased token) (err u104)) ;; Only allow if creator has purchased
      (let ((price-per-token (get-token-price token-id))
            (user-stx-amount (* amount price-per-token)))
        (if (> (stx-balance tx-sender) user-stx-amount)
            (abort "Insufficient STX balance.")
            (begin
              ;; Transfer 5% fee to the treasury
              (let ((fee (* user-stx-amount 5)))
                (stx-transfer! fee PLATFORM_TREASURY))
              ;; Transfer the remaining STX to mint tokens for the user
              (map-update balances tx-sender token-id (+ (map-get balances tx-sender token-id) amount))
              (map-update tokens token-id (tuple (creator (tuple-get token 'creator))
                                                          (name (tuple-get token 'name))
                                                          (symbol (tuple-get token 'symbol))
                                                          (total-supply (+ (tuple-get token 'total-supply) amount))
                                                          (market-cap (tuple-get token 'market-cap))
                                                          (start-price (tuple-get token 'start-price))
                                                          (creator-allocated-tokens (tuple-get token 'creator-allocated-tokens))
                                                          (creator-purchased (tuple-get token 'creator-purchased))))))))
  )
)

;; Sell Token Function
(define-public (sell-token (token-id uint) (amount uint))
  (let (
        (token (unwrap! (map-get? tokens { token-id: token-id }) (err u201)))
        (user-balance (default-to u0 (map-get? balances { token-id: token-id, user: tx-sender })))
        (price-per-token (get-token-price token-id))
        (total-stx (* amount price-per-token))
        (fee (/ total-stx u20)) ;; 5% fee
        (payout (- total-stx fee))
      )
    (begin
      (asserts! (>= user-balance amount) (err u202)) ;; User must have enough tokens
      ;; Burn tokens
      (map-set balances { token-id: token-id, user: tx-sender } (- user-balance amount))
      ;; Update total supply
      (map-set tokens { token-id: token-id }
        (merge token { total-supply: (- (get total-supply token) amount) }))
      ;; Transfer payout to user
      (unwrap! (stx-transfer? payout tx-sender) (err u203))
      ;; Transfer fee to treasury
      (unwrap! (stx-transfer? fee PLATFORM_TREASURY) (err u204))
      (ok true)
    )
  )
)

;; Get Token Price Function (Same as before)
(define-public (get-token-price (token-id uint))
  (let ((token (map-get tokens token-id)))
    (if (is-none token)
        (abort "Token not found.")
        ;; Calculate price based on bonding curve
        (let ((total-supply (tuple-get token 'total-supply))
              (start-price (tuple-get token 'start-price)))
          (* start-price (+ total-supply 1)) ;; Simple bonding curve (you can modify this)
    )
  )
)
