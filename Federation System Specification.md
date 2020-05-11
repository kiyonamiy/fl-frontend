# Federation System Specification

系统各个视图的编码说明及其描述，该系统主要是为了帮助分析人员分析在联邦学习的过程中，检测出一些异常的client行为.这是一个通用化的系统.



**整体流程：**

在client view中观察实时的概况，对于某个round很感兴趣，因为该round可能准确度突然下降，选择该轮次，在contribute/anomaly space中进行进一步分析.

在contribute/anomaly space中选择metric，根据metric计算出该轮次下异常值明显的client，heatmap和Gradient视图对该轮次下这些client进一步更为细致的数据展示.

heatmap中还能比较这些clients在整个训练过程中的整体走势，作为分析人员选择其他round的有效数据支持



---

### Clients View

**视图主要功能**：

​	在时间维度上，提供各个client在各个轮次的总体概况，主要包含为train/test中的loss/accuracy.具有(假)实时更新的功能，并且提供contributions和Gradients视图数据选择的入口(数据驱动视图).



#### **视图主要内容包含：**

- 状态：
  - clients有一个switch来切换client状态，自动/手动，默认为自动模式
  - 自动就是随着时间自动更新round，client中会有transition来过渡，自动模式下contribute/anomaly View和contribute View是空的，只有clients view和model information.
  - 手动模式下用户可以选择特定的round来进行进一步的分析，此时系统后端认为自动更新Round，即训练到了哪个Round仍然会跳
  - 即自动模式下：round都是最新的几(5)轮，手动模式下由用户决定

- 控制板块

  - 当前训练进度显示即Round：5/500,会随着时间流逝而自动更新(假实时)
  - Display，手动选择一个round，作为contributions和Gradients的数据输入，此时client的范围为[min(0,round - 2), max(500, round + 2)]，该功能只在手动模式下启动

- 盒须图

  两个坐标轴(accuracy/loss；avg of (train + test))，显示的是当前rounds**所有**clients的大致情况，

  交互：hover到某一个盒须图上，显示出连接该盒须图的线(loss or accuracy)

- server-clients

  server连接clients的图会一直存在，每个clients中的点代表了轮次，因为可能某一轮没有参与训练那么就空掉了.

- Round——柱状图

  - 为了显示的比例好看，可能就固定是5轮，也有可能是k轮，但不关键；每个Round下有一个进度条，也是假更新，进度条满了之后会显示柱状图(Test accuracy/Test loss)，还没有训练完成的时候，就显示虚线柱状图.
  - 柱状图显示的是k个，顺序由Avg of Test accuracy(k轮求平均)决定，从低到高(越低可能代表越异常，更值得关注)，因此为了模拟出实时效果，柱状图可能会上下切换顺序.
  - 交互1：hover到Round(titile)上，高亮该轮这一列的柱状图，**点击后表示选中该轮作为进一步分析**(Contribution和Gradients登场)
  - 交互2：hover到某一行的柱状图上，高亮Sever-Clients中的Clients并且文字显示提醒是哪一个Client，字母可以放到client长方形旁边也可以放在柱状图最右边，可以试试
  - 交互中的高亮:直接用透明度就可以了



---

### Contribution Space View

#### **视图主要功能**

​	进一步分析某一轮中各个client的具体情况.分析内容包括用平行坐标编码异常的metric和贡献度metric，投影了各个client embedding的结果，同时用带有时间维度的heatmap从时间跨度上分析其他轮次可能蕴含的异常行为.

​	分析的轮次由client view中用户指定.



#### 视图主要内容包括：

- Metric平行坐标系

  - 数据：只显示client中选定的round，作为计算依据
  - 分为两个部分，Contribution/anomaly space，都有下拉框多选metric，决定了该视图中选择参与计算的指标
  - 交互1：高亮，hover到某一条线上(一条线代表了一个client)，那么，concat space中对应的client、另一个space中对应的client以及heatmap(如果包含了)也要高亮，透明度即可
  - 交互2(暂时不做，待定)：在各个坐标轴上做lasso挑选出自己感兴趣的clients，相当于是搜出条件搜索，**选出来的client作为heatmap和gradients视图的数据入口**，lasso完后高亮

- Concat Space

  - 数据：只显示client中选的的round，作为计算依据
  - 把指定round中所有的client，按照选择的metric，embedding之后做投影
  - 交互1：高亮，hover到某一个点，metric space、heatmap(如果包含)也要高亮该client，透明度即可
  - 交互2：lasso，选出想要分析的client，**作为heatmap和gradients视图的数据入口**,lasso完后高亮

- heatmap

  - 数据：

    - 默认情况下选择TOP-K Clients，依据为当前Round(Client View决定)下，取所有clients中所选异常metric的均值，以此为依据选择topK，即单论TopK of avg(anomaly metrics) from high to low
    - lasso情况下：显示所有lasso的clients，排序方法跟默认的TOP-K相同
    - 根据anomaly选择出clients，contribution heatmap跟anomaly保持一致

  - 编码

    - 横轴：代表Round，从第一轮一直到Clinet View中的最新一轮
    - 纵轴代表了Client的异常值，约上面代表越异常
    - 色块：代表了value of x client in y round,越深代表越异常/贡献值越高

  - 高亮

    需要高亮当前Round，因为heatmap显示了所有的Round

    方法：左右两边加空白，类似于鱼眼但是不放大，不扭曲，在两个heatmap中间的缝隙里文字在对应的Round显示，并且文字上下可以加上划线和下划线式高亮来提醒说明

  - 交互

    - heatmap最左边应该有文字代表是哪个client，hover上去后高亮该行，同样space空间中该client也应该被高亮
    - 在某个色块上hover时，高亮该列，即该round，双击代表选择该round作为分析，相当于修改了client view中的display值
    - 刷新按钮，因为手动模式下后台仍在训练，会有新的round需要heatmap去显示，刷新按钮上显示一个小数字代表有x轮信息没有展示(微信未读消息)，可以放在heatmap整体的右上角或者最右边一列或者其他地方，要好看

- 关于该视图的高亮优先级

  - hover高亮 > lasso高亮，也就是hover高亮的时候，就算被lasso高亮了，没被hover到也会暗掉，但是不hover了回复到lasso高亮



---

### Gradients

#### 视图主要功能：

​	用来显示选定的clients在选定的round下，梯度的表现,包含两部分，该轮减去上一轮(第一轮默认均为0)，该轮减去该轮所有参与训练client的梯度平均



#### 数据来源：

contribution/anomaly那里，heatmap中所显示的client，即默认topk或者lasso clients



#### 视图内容：

- 折线图，暂时不要背景色(就是折线的区域色,蓝色和红色的那个)，线的颜色均为灰色，横轴不放在底部放在中间0那里，不需要背景灰色刻度线.
- 高亮，client在space和heatmap里被高亮的时候，gradient也要被高亮，同样透明度即可



---

### Model Information

模型中每个层都是能选的，选中为蓝色，不选中会灰色，点击选中/不选择，默认为conv1 conv2和dense1，改变Model information，相当于右边两个视图重新计算.

可以先不管，先把样子做出来.

