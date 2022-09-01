import './App.css';
import logo3 from "./images/logo3.png";
import ficon1 from "./images/ficon1.png";
import ficon2 from "./images/ficon2.png";
import ficon3 from "./images/ficon3.png";

const App = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div style={{ width: '200px', backgroundColor: '#cc3101' }} className="btn-animate"> <a href="#" rel="noreferrer" style={{ color: '#fff' }} className="btn-signin">Connect</a> </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <img src={logo3} style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', marginBottom: '30px' }} alt="Baked Bread" />
        </div>

        <div className="col-md-12">
          <h4 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>The BNB Reward Pool with the tastiest <br /> daily return and lowest dev fee</h4>
        </div>
      </div>

      <div className="frame">
        <div>
          <div className="row">
            <div className="col-md-6">
              <h4 className="colwh1">Contract</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">0 BNB</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">Wallet</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">0 BNB</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">Your Potatos</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">0 Potatos</h4>
            </div>
          </div>

          <div className="row" style={{ paddingLeft: '35px', paddingTop: '18px', backgroundColor: '#4e4e0e', marginTop: '12px' }}>
            <div className="col-md-7">
              <input className="form-styling" type="text" name="username" placeholder="0" />
            </div>

            <div className="col-md-5">
              <h4 className="colwh3">BNB</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="btn-animate"> <a href="#" rel="noreferrer" className="btn-signin">Bake Potatos</a> </div>
            </div>

            <div className="col-md-12">
              <hr className="hr1" />
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">Your Rewards</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">0 BNB</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div style={{ marginLeft: '32px' }} className="btn-animate"> <a href="#" rel="noreferrer" className="btn-signin">Re Bake</a> </div>
            </div>

            <div className="col-md-6">
              <div className="btn-animate"> <a href="#" rel="noreferrer" className="btn-signin">Eat Potatos</a> </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '25px', height: '315px' }} className="frame">
        <div ng-app="true" ng-init="checked = false">
          <div className="row">
            <div className="col-md-12">
              <h4 className="colwh1">Nutrition Facts</h4>
            </div>

            <div className="col-md-12">
              <hr className="hr2" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h4 className="colwh1">Daily Return</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">8%</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">APR</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">2,920%</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">Dev Fee</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">3%</h4>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '25px', height: '260px' }} className="frame">
        <div>
          <div className="row">
            <div className="col-md-12">
              <h4 className="colwh1">Referral Link</h4>
            </div>

            <div className="col-md-12">
              <hr className="hr2" />
            </div>
          </div>

          <div className="row" style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '18px', backgroundColor: '#4e4e0e' }}>
            <div className="col-md-12">
              <input className="form-styling" type="text" name="username" placeholder="" />
            </div>
          </div>

          <div className="row" style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '18px' }}>
            <div className="col-md-12">
              <h6 className="colwh4">Earn 12% of the BNB used to bake beans from anyone who uses your referral link</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '18px' }}>
        <div className="col-md-5"></div>
        <div className="col-md-4">
          <img className="img-1" src={ficon1} alt="telegram" />

          <img className="img-2" src={ficon2} alt="BSC explorer" />

          <img className="img-3" src={ficon3} alt="twitter" />
        </div>
      </div>
    </div>
  )
}

export default App;
