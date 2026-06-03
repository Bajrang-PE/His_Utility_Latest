import React, { useEffect, useState } from "react";
import { Menu, MenuItem, SubMenu, Sidebar } from "react-pro-sidebar";
import { FaBars } from "react-icons/fa";
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FaIcons from "react-icons/fa";
import useImageWithFallback from "../../hooks/useImageWithFallback";


const DynamicImage = React.memo(({ iconName }) => {
    const imageSrc = useImageWithFallback(iconName);

    return (
        <img
            src={imageSrc}
            alt="menu-icon"
            className="menu-icon-image"
            style={{ width: '16px', height: '16px' }}
        />
    );
});

const DashSidebar = ({ data, setActiveTab, activeTab, dashboardData, setPrevKpiTab, dt, setAllDrpDtParams }) => {

    const [collapsed, setCollapsed] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null);

    const rootTabs = data?.filter(dt => dt?.jsonData?.isTabUsedForDrillDown === "No")?.filter(tab => !tab.jsonData.parentTabId || tab.jsonData.parentTabId === "0");

    // Fetch child tabs with memoization
    const getChildTabs = (parentId) => {
        return data?.filter(tab => tab.jsonData.parentTabId === String(parentId));
    };

    // Config from dashboardData
    const tabFontColourHover = dashboardData?.jsonData?.tabFontColourHover || "#ffffff";
    const tabColourHover = dashboardData?.jsonData?.tabColourHover || "#ccac7c";
    const tabFont = dashboardData?.jsonData?.tabFont || "#ffffff";
    const isSidebarCollapse = dashboardData?.jsonData?.isSidebarCollapse || 'Yes';

    const getDynamicIcon = (iconName) => {
        if (!iconName) return <FontAwesomeIcon icon={SolidIcons.faBarChart} />;

        if (iconName?.includes("_") || iconName?.includes("-")) {
            const formattedIconName =
                "fa" +
                iconName
                    .replace(/-o$/, "")
                    .replace(/^fa-/, "")
                    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

            const iconKey = Object.keys(SolidIcons).find(
                (key) =>
                    key.toLowerCase() === formattedIconName.toLowerCase() ||
                    key
                        .toLowerCase()
                        .includes(
                            formattedIconName.replace(/[^a-zA-Z]/g, "").toLowerCase()
                        )
            );

            const IconDef = iconKey ? SolidIcons[iconKey] : SolidIcons.faBarChart;
            return <FontAwesomeIcon icon={IconDef} />;
        }

        const Cmp = FaIcons[iconName] || FaBars;
        return <Cmp />;
    };


    useEffect(() => {
        if (rootTabs.length > 0) {
            setActiveTab(rootTabs[0]);
            setOpenSubMenu(rootTabs[0]?.id);
        } else if (data?.length > 0) {
            setActiveTab(data[0]);
            setOpenSubMenu(data[0]?.id);
        }
    }, [data]);

    const toggleSidebar = () => setCollapsed(prev => !prev);

    const handleSubMenuClick = (submenu) => setOpenSubMenu(openSubMenu === submenu ? null : submenu);

    const handleHover = (id, isHover) => {
        const element = document.getElementById(id);
        if (element) {
            element.style.color = isHover ? tabFontColourHover : tabFont;
            element.style.backgroundColor = isHover ? tabColourHover : "transparent";
        }
    };

    return (
        <Sidebar width="270px" style={{ minHeight: "100vh", color: "#ECF0F1" }} collapsed={collapsed} toggled backgroundColor="#071b2f">
            <Menu iconShape="square">
                <MenuItem className="menu-item-container">
                    {!collapsed && <span><b>{dt(dashboardData?.jsonData?.groupName || "Dashboard")}</b></span>}
                    {isSidebarCollapse !== 'No' && (
                        <FaBars onClick={() => toggleSidebar()} className="menu-icon-right" />
                    )}
                </MenuItem>

                <b><h6 className='header-devider'></h6></b>

                {(rootTabs?.length > 0 ? rootTabs : data)?.map((tab) => {
                    const childTabs = getChildTabs(tab.id);
                    const isActive = activeTab?.jsonData?.dashboardId === tab?.jsonData?.dashboardId;

                    if (childTabs.length > 0) {
                        return (
                            <SubMenu
                                key={tab.id}
                                label={!collapsed && tab?.jsonData?.dashboardActualName}
                                icon={tab?.jsonData?.isCSSTabIconRequired === "No" ? <DynamicImage iconName={tab?.jsonData?.iconImageName} /> : getDynamicIcon(tab?.jsonData?.iconName)}
                                className={`submenu-tab-side ${isActive ? 'activeSideTab' : ''}`}
                                open={activeTab?.jsonData?.parentTabId == tab.id || openSubMenu == tab.id}
                                onClick={() => {
                                    handleSubMenuClick(tab.id);
                                    setActiveTab(tab);
                                    setPrevKpiTab([]);
                                    setAllDrpDtParams([]);
                                }}
                                id={`menu-tab-item${tab.id}`}
                                onMouseOver={() => handleHover(`menu-tab-item${tab.id}`, true)}
                                onMouseOut={() => handleHover(`menu-tab-item${tab.id}`, false)}
                                style={{ color: tabFont }}
                            >
                                {childTabs.map(child => (
                                    <MenuItem
                                        key={child.id}
                                        onClick={() => { setActiveTab(child); setPrevKpiTab([]); setAllDrpDtParams([]); }}
                                        className={`menu-tab-item ${activeTab?.jsonData?.dashboardId === child?.jsonData?.dashboardId ? 'activeSideTab' : ''}`}
                                        icon={getDynamicIcon(child?.jsonData?.iconName)}
                                        id={`menu-tab-item${child.id}`}
                                        onMouseOver={() => handleHover(`menu-tab-item${child.id}`, true)}
                                        onMouseOut={() => handleHover(`menu-tab-item${child.id}`, false)}
                                        style={{ color: tabFont }}
                                    >
                                        {child?.jsonData?.dashboardName}
                                    </MenuItem>
                                ))}
                            </SubMenu>
                        );
                    }

                    return (
                        <MenuItem
                            key={tab.id}
                            // icon={getDynamicIcon(tab?.jsonData?.iconName)}
                            icon={tab?.jsonData?.isCSSTabIconRequired === "No" ?
                                <DynamicImage iconName={tab?.jsonData?.iconImageName} />
                                : getDynamicIcon(tab?.jsonData?.iconName)}
                            onClick={() => { setActiveTab(tab); handleSubMenuClick(''); setPrevKpiTab([]); setAllDrpDtParams([]); }}
                            className={`menu-tab-item ${isActive ? 'activeSideTab' : ''}`}
                            id={`menu-tab-item${tab.id}`}
                            onMouseOver={() => handleHover(`menu-tab-item${tab.id}`, true)}
                            onMouseOut={() => handleHover(`menu-tab-item${tab.id}`, false)}
                            style={{ color: tabFont }}
                        >
                            {!collapsed && tab?.jsonData?.dashboardName}
                        </MenuItem>
                    );
                })
                }
            </Menu>
        </Sidebar>
    );
};

export default DashSidebar;
