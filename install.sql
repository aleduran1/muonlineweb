ALTER TABLE [MEMB_INFO]
ADD [premiumdone] int NOT NULL DEFAULT ((0)) ,
[accesslevel] int NOT NULL DEFAULT ((0)) ,
[mucoins] int NOT NULL DEFAULT ((0)) ,
[resetPasswordToken] varchar(255) NULL ,
[resetPasswordExpires] datetime NULL ,
[ultratop100_voted] datetime NULL 

-- ----------------------------
-- Table structure for News
-- ----------------------------
CREATE TABLE [dbo].[News] (
[id] int NOT NULL IDENTITY(1,1) ,
[title] varchar(255) NULL ,
[content] varchar(MAX) NULL ,
[author] varchar(255) NULL ,
[active] int NULL ,
[created_at] datetime NULL 
)

-- ----------------------------
-- Table structure for Webshop_categories
-- ----------------------------
CREATE TABLE [dbo].[Webshop_categories] (
[id] int NOT NULL IDENTITY(1,1) ,
[name] varchar(255) NULL ,
[discount] int NULL ,
[active] int NULL 
)

-- ----------------------------
-- Table structure for Webshop_items
-- ----------------------------
CREATE TABLE [dbo].[Webshop_items] (
[id] int NOT NULL IDENTITY(1,1) ,
[name] varchar(255) NULL ,
[hex] varchar(32) NULL ,
[discount] int NULL ,
[active] int NULL ,
[categoryid] int NULL ,
[cost] int NULL ,
[maxLevel] int NULL ,
[maxOption] int NULL ,
[canLuck] int NULL ,
[canSkill] int NULL ,
[excellentOption1] int NULL ,
[excellentOption2] int NULL ,
[excellentOption3] int NULL ,
[excellentOption4] int NULL ,
[excellentOption5] int NULL ,
[excellentOption6] int NULL ,
[maxExcellent] int NULL 
)

-- ----------------------------
-- Table structure for Marketplace
-- ----------------------------
CREATE TABLE [dbo].[Marketplace] (
[id] int NOT NULL IDENTITY(1,1) ,
[name] varchar(255) NULL ,
[description] varchar(255) NULL,
[hex] varchar(32) NULL ,
[cost] int NULL ,
[publisher] varchar(255) NULL ,
[created_at] datetime NULL 
)
DBCC CHECKIDENT(Marketplace, RESEED, 132465)