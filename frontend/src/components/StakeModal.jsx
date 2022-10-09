import React from 'react'

const StakeModal = ({ onClose, amount, setAmount, stake }) => {
    return (
        <>
            <div className='modal-class' onClick={onClose}>
                <div className="modal-content" onClick={async (e) => { e.stopPropagation() }}>
                    <div className="modal-body">
                        <h2 className='titleHeader'>Stake Potato</h2>

                        <div className="row">
                            <div className="col-md-9 fieldContainer">
                                <input className='inputField' placeholder='0.0' onChange={e => setAmount(e.target.value)} />
                            </div>

                            <div className='col-md-3 inputFieldContainer'>
                                <span>Potato</span>
                            </div>
                        </div>

                        {/* <div className="row">
                            <h6 className='titleHeader stakingTerms'>
                                {lockPeriods[0]} days @ {stakingPercent} APY
                            </h6>
                            <h6 className='titleHeader stakingTerms'>
                                {lockPeriods[1]} days @ {stakingPercent} APY
                            </h6>
                            <h6 className='titleHeader stakingTerms'>
                                {lockPeriods[2]} days @ {stakingPercent} APY
                            </h6>
                        </div> */}

                        <div className="row">
                            <div onClick={() => stake(amount)} className="orangeButton">
                                Stake Potato
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default StakeModal;