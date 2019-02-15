import "../scss/style.scss";
import TxListCompact from "../components/TxListCompact/TxListCompact";
import React, {Component} from 'react';
import {getTransactions, getTxCount} from '../api-client'
import PageHeader from "../components/PageHeader/PageHeader";
import {Grid, Pagination} from "semantic-ui-react";
import util from 'util'
import Router from "next/dist/lib/router";
import {getDefaultNetwork} from "../api-client";

class Txs extends Component {

    static getProtocol(req) {
        return (req && req.headers['X-Forwarded-Server']) ? 'https' : req.protocol;
    }

    static getBaseUrl(req) {
        return req ? `${this.getProtocol(req)}://${req.get('Host')}` : '';
    }

    handleClick(e, data) {
        const {activePage} = data;
        const {baseUrl, network, txType, pageSize} = this.props;
        Router.push(
            `${baseUrl}/txs?network=${network}&txType=${txType}&page=${activePage}&pageSize=${pageSize}`,
            `/txs/${network}/${txType}?page=${activePage}&pageSize=${pageSize}`
        );
    }

    static async getInitialProps({req, query}) {
        const {network, txType} = query;
        const page = (!!query.page) ? query.page : 1
        const pageSize = (!!query.pageSize) ? query.pageSize : 50
        const fromRecentTx = (page-1) * pageSize;
        const toRecentTx = page * pageSize;
        const baseUrl = this.getBaseUrl(req);
        const domainTxs = await getTransactions(baseUrl, network, txType, fromRecentTx || 0, toRecentTx || pageSize);
        const txCount = await getTxCount(baseUrl, network, txType);
        console.log(`Txs page loaded baseurl = ${baseUrl}`);
        return {
            txs: domainTxs.txs,
            network,
            txType,
            baseUrl,
            txCount,
            page,
            pageSize
        }
    }

    render() {
        const {txType, network, txCount, page, baseUrl, pageSize} = this.props;
        const pageCount = Math.ceil(txCount / pageSize);
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <PageHeader page={txType || "home"} network={network} baseUrl={baseUrl}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Pagination defaultActivePage={page} totalPages={pageCount} onPageChange={(e, data) => this.handleClick(e, data)}/>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <TxListCompact baseUrl={this.props.baseUrl} network={this.props.network} txType={this.props.txType} txs={this.props.txs}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Pagination defaultActivePage={page} totalPages={pageCount} onPageChange={(e, data) => this.handleClick(e, data)}/>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Txs;