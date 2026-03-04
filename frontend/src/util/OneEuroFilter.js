class LowPassFilter {
  // cấu hình alpha trong khoảng giá trị (0,1)
  setAlpha(alpha) {
    if (alpha<=0.0 || alpha>1.0) 
      console.log("alpha should be in (0.0, 1.0]");
    this.a = alpha;
  }
  // khởi tạo biến 
  constructor(alpha, initval=0.0) {
    this.y = this.s = initval; // s là giá trị ban đầu (tọa độ ban đầu), y là giá trị mới sau khoảng lấy mẫu thu được (tọa độ sau đó)
    this.setAlpha(alpha);
    this.initialized = false;
  }
  // bộ lọc thông thấp 
  filter(value) {
    var result;
    if (this.initialized)
        // Công thức: y[i] = alpha * x[i] + (1 - alpha) * y[i-1]
      result = this.a*value + (1.0-this.a) * this.s;
    else {
      result = value;
      this.initialized = true;
    }
    this.y = value;
    this.s = result;
    return result;
  }
  // làm mịn vận tốc
  filterWithAlpha(value, alpha) {
    this.setAlpha(alpha);
    return this.filter(value);
  }
  // dữ liệu thô khởi tạo
  hasLastRawValue() {
    return this.initialized;
  }
  // giá trị thô ban đầu
  lastRawValue() {
    return this.y;
  }
  // giá trị sau khi lọc
  lastFilteredValue() {
    return this.s;
  }

  reset() {
    this.initialized = false;
  }

}



// -----------------------------------------------------------------

export class OneEuroFilter {

  alpha(cutoff) {
    var te = 1.0 / this.freq; // chu kỳ lấy mẫy Te = 1/ t (số lần lấy mẫu trong 1s)
    var tau = 1.0 / (2 * Math.PI * cutoff); // hệ số thời gian tính theo công thức chu kỳ
    return 1.0 / (1.0 + tau/te);
  }
  // khởi tạo tần số
  setFrequency(f) {
    if (f<=0) console.log("freq should be >0") ;
    this.freq = f;
  }
  // khởi tạo tần số cắt nhỏ nhất
  setMinCutoff(mc) {
    if (mc<=0) console.log("mincutoff should be >0");
    this.mincutoff = mc;
  }

  setBeta(b) {
    this.beta_ = b;
  }
  // tần số cắt mặc định
  setDerivateCutoff(dc) {
    if (dc<=0) console.log("dcutoff should be >0") ;
    this.dcutoff = dc ;
  }

  constructor(freq, mincutoff=1.0, beta_=0.0, dcutoff=1.0) {
    this.setFrequency(freq) ;
    this.setMinCutoff(mincutoff) ;
    this.setBeta(beta_) ;
    this.setDerivateCutoff(dcutoff) ;
    this.x = new LowPassFilter(this.alpha(mincutoff)) ;
    this.dx = new LowPassFilter(this.alpha(dcutoff)) ;
    this.lasttime = undefined ;
  }

  reset() {
    this.x.reset();
    this.dx.reset();
    this.lasttime = undefined;
  }

  filter(value, timestamp=undefined) {
    // update the sampling frequency based on timestamps
    if (this.lasttime!=undefined && timestamp!=undefined && timestamp > this.lasttime)
      this.freq = 1.0 / (timestamp-this.lasttime) ;
    this.lasttime = timestamp ;
    // estimate the current variation per second 
    var dvalue = this.x.hasLastRawValue() ? (value - this.x.lastFilteredValue())*this.freq : 0.0 ; 
    var edvalue = this.dx.filterWithAlpha(dvalue, this.alpha(this.dcutoff)) ;
    // use it to update the cutoff frequency
var cutoff = this.mincutoff + this.beta_ * Math.abs(edvalue) ;
    // filter the given value
    return this.x.filterWithAlpha(value, this.alpha(cutoff)) ;
  }
}